const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const {
  simulatePayment,
  getLast4Digits,
} = require("../utils/paymentSimulator");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentDetails, items, total } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in cart",
      });
    }

    // Validate payment details
    if (!paymentDetails || !paymentDetails.method) {
      return res.status(400).json({
        success: false,
        message: "Payment details and method are required",
      });
    }

    // Simulate payment processing based on method
    const paymentResult = await simulatePayment(paymentDetails);

    // If payment fails, return error without creating order
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.message || "Payment processing failed",
        paymentError: true,
      });
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
    const shippingPrice = 15; // Fixed shipping price
    const taxPrice = itemsPrice * 0.08; // 8% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order items array
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
    }));

    // Prepare payment details for storage based on payment method
    let orderPaymentDetails = {
      method: paymentDetails.method,
      status: paymentResult.status || "completed",
      transactionId: paymentResult.transactionId,
    };

    if (paymentDetails.method === "card") {
      orderPaymentDetails.cardLast4 = getLast4Digits(paymentDetails.cardNumber);
      orderPaymentDetails.cardName = paymentDetails.cardName;
    } else if (paymentDetails.method === "digitalWallet") {
      orderPaymentDetails.walletType = paymentDetails.walletType;
      orderPaymentDetails.walletEmail = paymentDetails.walletEmail;
    } else if (paymentDetails.method === "bankTransfer") {
      orderPaymentDetails.bankName = paymentDetails.bankName;
      orderPaymentDetails.accountLast4 = paymentDetails.accountNumber
        ? paymentDetails.accountNumber.slice(-4)
        : "";
      orderPaymentDetails.routingNumber = paymentDetails.routingNumber;
      if (paymentDetails.transactionId) {
        orderPaymentDetails.transactionId = paymentDetails.transactionId;
      }
    }
    // Cash on Delivery: no additional fields needed

    // Determine initial order status based on payment method
    // Card and Digital Wallet: payment completed, order processing
    // Bank Transfer and Cash on Delivery: payment pending, order processing
    const initialOrderStatus = "processing";

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentDetails: orderPaymentDetails,
      subtotal: itemsPrice,
      tax: taxPrice,
      shippingCost: shippingPrice,
      total: totalPrice,
      status: initialOrderStatus,
    });

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      order,
      paymentStatus: paymentResult.status || "completed",
      transactionId: paymentResult.transactionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name images");

    if (order) {
      // Check if the order belongs to the logged-in user or if user is admin
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this order",
        });
      }

      res.json({
        success: true,
        order,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images price")
      .sort("-createdAt");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === "shipped") {
        order.trackingNumber = `NS${Date.now()}`;
      }

      const updatedOrder = await order.save();
      res.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "firstName lastName email")
      .populate("items.product", "name images price")
      .sort("-createdAt");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
};
