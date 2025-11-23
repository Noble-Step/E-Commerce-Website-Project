const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  sizes: [
    {
      type: String,
    },
  ],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
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
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Database indexes for performance
productSchema.index({ name: "text" }); // Text index for search
productSchema.index({ category: 1 }); // Index for category filtering
productSchema.index({ price: 1 }); // Index for price sorting/filtering
productSchema.index({ createdAt: -1 }); // Index for sorting by creation date
productSchema.index({ category: 1, price: 1 }); // Compound index for category + price queries

module.exports = mongoose.model("Product", productSchema);
