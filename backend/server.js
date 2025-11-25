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
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
}

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.set("trust proxy", 1);

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

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

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

if (process.env.NODE_ENV === "production") {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Endpoint not found",
      path: req.originalUrl,
    });
  });
}

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

