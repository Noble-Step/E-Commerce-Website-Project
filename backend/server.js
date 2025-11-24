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
  // Don't exit in production (Vercel serverless)
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
}

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// ✅ Trust proxy for Vercel
app.set("trust proxy", 1);

// Security middleware with Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
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
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ FIXED: Updated CORS to allow your Vercel frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Disable file logging for Vercel (serverless is read-only)
// app.use(httpLogger); // Commented out - use console.log or cloud logging instead
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Compression middleware
app.use(
  compression({
    level: 6,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return true;
    },
  })
);

// Rate limiter with proper proxy configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

// Basic route for testing
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Noble Step E-Commerce API" });
// });

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

// Serve React app in production (catch-all route - MUST be last!)
if (process.env.NODE_ENV === "production") {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  // 404 handler for development only
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Endpoint not found",
      path: req.originalUrl,
    });
  });
}

// ✅ CRITICAL FIX: Connect to database and handle Vercel serverless
let isConnected = false;

const ensureDbConnection = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectDb();
    isConnected = true;
    infoLogger("📊 Database connected for serverless function");
  } catch (error) {
    errorLogger("Database connection failed", error);
    throw error;
  }
};

// Start Server
const startServer = async () => {
  try {
    await connectDb();
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

// ✅ CRITICAL: Export for Vercel
// module.exports = app;
