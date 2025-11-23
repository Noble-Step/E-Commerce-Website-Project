const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const {
  validateProductCreation,
  validateProductUpdate,
  validateProductId,
  validateProductQuery,
} = require("../middleware/validationMiddleware");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");

router
  .route("/")
  .get(validateProductQuery, cacheMiddleware(300), getProducts) // Cache for 5 minutes
  .post(protect, admin, handleUpload, validateProductCreation, createProduct);

router
  .route("/:id")
  .get(validateProductId, cacheMiddleware(600), getProductById) // Cache for 10 minutes
  .put(
    protect,
    admin,
    validateProductId,
    handleUpload,
    validateProductUpdate,
    updateProduct
  )
  .delete(protect, admin, validateProductId, deleteProduct);

module.exports = router;
