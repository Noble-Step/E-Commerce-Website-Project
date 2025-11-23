const fs = require("fs");
const path = require("path");

/**
 * Custom logging middleware for HTTP requests and application events
 * Creates logs in /backend/logs/ directory
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const errorLogPath = path.join(logsDir, "error.log");
const accessLogPath = path.join(logsDir, "access.log");

/**
 * Format timestamp for logging
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * HTTP Request Logger Middleware
 * Logs all incoming requests
 */
const httpLogger = (req, res, next) => {
  const startTime = Date.now();

  // Capture the response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logMessage = `[${getTimestamp()}] ${req.method} ${
      req.originalUrl
    } - Status: ${res.statusCode} - Duration: ${duration}ms\n`;

    // Write to access log
    fs.appendFileSync(accessLogPath, logMessage);

    // Log errors to error log
    if (res.statusCode >= 400) {
      fs.appendFileSync(errorLogPath, logMessage);
    }
  });

  next();
};

/**
 * Application error logger
 * Logs errors that occur during application runtime
 */
const errorLogger = (message, error = null) => {
  const logMessage = `[${getTimestamp()}] ERROR: ${message}${
    error ? ` - ${error.message}` : ""
  }\n`;
  fs.appendFileSync(errorLogPath, logMessage);
  console.error(logMessage);
};

/**
 * Application info logger
 * Logs important application events
 */
const infoLogger = (message) => {
  const logMessage = `[${getTimestamp()}] INFO: ${message}\n`;
  const infoLogPath = path.join(logsDir, "info.log");
  fs.appendFileSync(infoLogPath, logMessage);
  console.log(logMessage);
};

/**
 * Database event logger
 * Logs database connection events
 */
const dbLogger = (message) => {
  const logMessage = `[${getTimestamp()}] DB: ${message}\n`;
  const dbLogPath = path.join(logsDir, "database.log");
  fs.appendFileSync(dbLogPath, logMessage);
  console.log(logMessage);
};

/**
 * Authentication event logger
 * Logs auth-related events (logins, registrations, etc.)
 */
const authLogger = (event, userId, email, details = "") => {
  const logMessage = `[${getTimestamp()}] AUTH [${event}] - User: ${userId} (${email}) ${details}\n`;
  const authLogPath = path.join(logsDir, "auth.log");
  fs.appendFileSync(authLogPath, logMessage);
};

module.exports = {
  httpLogger,
  errorLogger,
  infoLogger,
  dbLogger,
  authLogger,
  getTimestamp,
};
