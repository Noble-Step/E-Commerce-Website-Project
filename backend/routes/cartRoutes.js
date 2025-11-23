const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateCartAddition,
  validateCartUpdate,
} = require("../middleware/validationMiddleware");

router
  .route("/")
  .get(protect, getCart)
  .post(protect, validateCartAddition, addToCart)
  .delete(protect, clearCart);

router
  .route("/:itemId")
  .put(protect, validateCartUpdate, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router;
