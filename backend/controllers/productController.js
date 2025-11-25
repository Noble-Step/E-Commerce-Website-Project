const Product = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const {
  clearProductCache,
  clearProductByIdCache,
} = require("../middleware/cacheMiddleware");

const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, limit } = req.query;
    let query = {};

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

const createProduct = async (req, res) => {
  try {
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => {
        return `/uploads/shoes/${file.filename}`;
      });
    } else if (req.body.images && Array.isArray(req.body.images)) {
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

    clearProductCache();

    res.status(201).json({
      success: true,
      product: createdProduct,
    });
  } catch (error) {
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

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let newImagePaths = [];
    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map((file) => {
        return `/uploads/shoes/${file.filename}`;
      });
    }

    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : JSON.parse(req.body.existingImages)
      : [];

    const allImages = [...existingImages, ...newImagePaths];

    if (req.body.removedImages) {
      const removedImages = Array.isArray(req.body.removedImages)
        ? req.body.removedImages
        : JSON.parse(req.body.removedImages);

      removedImages.forEach((imagePath) => {
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

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
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
