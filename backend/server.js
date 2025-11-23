require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const { validateEnvironment } = require("./utils/environment");
const connectDb = require("./config/db");
const {
  httpLogger,
  errorLogger,
  infoLogger,
  dbLogger,
  authLogger,
} = require("./middleware/loggingMiddleware");

try {
  const envCheck = validateEnvironment();
  infoLogger(`Environment validation passed`);
} catch (error) {
  console.error("❌ Environment validation failed:");
  console.error(error.message);
  process.exit(1);
}

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Security middleware with Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"], // Allow images from backend
        connectSrc: [
          "'self'",
          process.env.FRONTEND_URL || "http://localhost:3000",
        ],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Logging middleware
app.use(httpLogger);

// Compression middleware (should be before routes)
app.use(
  compression({
    level: 6, // Compression level (0-9, 6 is a good balance)
    filter: (req, res) => {
      // Don't compress responses if client doesn't support it
      if (req.headers["x-no-compression"]) {
        return false;
      }
      // Compress all other responses
      return true;
    },
  })
);

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Noble Step E-Commerce API" });
});

// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  errorLogger(`Unhandled error on ${req.method} ${req.originalUrl}`, err);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDb();

    // Start server only after database connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      infoLogger(`🚀 Server is running on port ${PORT}`);
      infoLogger(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    errorLogger("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
