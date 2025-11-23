const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  validateOrderCreation,
  validateOrderId,
  validateProductId,
} = require("../middleware/validationMiddleware");

router
  .route("/")
  .post(protect, validateOrderCreation, createOrder)
  .get(protect, admin, getAllOrders);

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(protect, validateOrderId, getOrderById);

router
  .route("/:id/status")
  .put(protect, admin, validateOrderId, updateOrderStatus);

module.exports = router;
