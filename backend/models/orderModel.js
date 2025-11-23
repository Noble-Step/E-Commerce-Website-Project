const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      size: String,
    },
  ],
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentDetails: {
    method: {
      type: String,
      required: true,
      enum: ["card", "digitalWallet", "bankTransfer", "cashOnDelivery"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    transactionId: String,
    // Card payment fields
    cardLast4: String,
    cardName: String,
    // Digital wallet fields
    walletType: String, // "paypal", "googlepay", "applepay"
    walletEmail: String,
    // Bank transfer fields
    bankName: String,
    accountLast4: String, // Store last 4 digits only for security
    routingNumber: String,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  trackingNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Database indexes for performance
orderSchema.index({ user: 1 }); // Index for user queries
orderSchema.index({ createdAt: -1 }); // Index for sorting by creation date
orderSchema.index({ status: 1 }); // Index for status filtering
orderSchema.index({ user: 1, createdAt: -1 }); // Compound index for user orders sorted by date

module.exports = mongoose.model("Order", orderSchema);
