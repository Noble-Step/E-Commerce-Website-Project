const Product = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const {
  clearProductCache,
  clearProductByIdCache,
} = require("../middleware/cacheMiddleware");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, limit } = req.query;
    let query = {};

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          sort.price = 1;
          break;
        case "price-desc":
          sort.price = -1;
          break;
        case "newest":
          sort.createdAt = -1;
          break;
        case "rating":
          sort["ratings.average"] = -1;
          break;
      }
    }

    // Build query with optional limit
    let productQuery = Product.find(query).sort(sort);
    if (limit) {
      const limitNum = parseInt(limit);
      if (limitNum > 0) {
        productQuery = productQuery.limit(limitNum);
      }
    }

    const products = await productQuery;
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({
        success: true,
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // Get image paths from uploaded files
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => {
        // Return path that can be accessed via /uploads route (leading slash)
        return `/uploads/shoes/${file.filename}`;
      });
    } else if (req.body.images && Array.isArray(req.body.images)) {
      // Fallback: if images are sent as URLs (for backward compatibility)
      imagePaths = req.body.images;
    }

    if (imagePaths.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock: parseInt(req.body.stock),
      images: imagePaths,
      sizes: req.body.sizes
        ? Array.isArray(req.body.sizes)
          ? req.body.sizes
          : JSON.parse(req.body.sizes)
        : [],
    });

    const createdProduct = await product.save();

    // Clear product list cache when new product is created
    clearProductCache();

    res.status(201).json({
      success: true,
      product: createdProduct,
    });
  } catch (error) {
    // Clean up uploaded files if product creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(
          __dirname,
          "../uploads/shoes",
          file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle new image uploads
    let newImagePaths = [];
    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map((file) => {
        return `/uploads/shoes/${file.filename}`;
      });
    }

    // Get existing images from body (if any are being kept)
    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : JSON.parse(req.body.existingImages)
      : [];

    // Combine existing and new images
    const allImages = [...existingImages, ...newImagePaths];

    // Delete old images that are no longer in use
    if (req.body.removedImages) {
      const removedImages = Array.isArray(req.body.removedImages)
        ? req.body.removedImages
        : JSON.parse(req.body.removedImages);

      removedImages.forEach((imagePath) => {
        // Only delete if it's a local file (starts with /uploads)
        if (
          typeof imagePath === "string" &&
          imagePath.startsWith("/uploads/")
        ) {
          const relativePath = imagePath.replace(/^\/+/, "");
          const filePath = path.join(__dirname, "..", relativePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    // Update product fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price =
      req.body.price !== undefined ? parseFloat(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.stock =
      req.body.stock !== undefined ? parseInt(req.body.stock) : product.stock;
    product.images = allImages.length > 0 ? allImages : product.images;
    product.sizes = req.body.sizes
      ? Array.isArray(req.body.sizes)
        ? req.body.sizes
        : JSON.parse(req.body.sizes)
      : product.sizes;

    const updatedProduct = await product.save();

    // Clear cache for this specific product and product list
    clearProductByIdCache(req.params.id);
    clearProductCache();

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete associated image files
      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
          // Only delete local files
          if (
            typeof imagePath === "string" &&
            imagePath.startsWith("/uploads/")
          ) {
            const relativePath = imagePath.replace(/^\/+/, "");
            const filePath = path.join(__dirname, "..", relativePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        });
      }

      await product.deleteOne();

      // Clear cache for this specific product and product list
      clearProductByIdCache(req.params.id);
      clearProductCache();

      res.json({
        success: true,
        message: "Product removed",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
