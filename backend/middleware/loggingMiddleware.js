const fs = require("fs");
const path = require("path");



const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const errorLogPath = path.join(logsDir, "error.log");
const accessLogPath = path.join(logsDir, "access.log");


const getTimestamp = () => {
  return new Date().toISOString();
};


const httpLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logMessage = `[${getTimestamp()}] ${req.method} ${
      req.originalUrl
    } - Status: ${res.statusCode} - Duration: ${duration}ms\n`;

    fs.appendFileSync(accessLogPath, logMessage);

    if (res.statusCode >= 400) {
      fs.appendFileSync(errorLogPath, logMessage);
    }
  });

  next();
};


const errorLogger = (message, error = null) => {
  const logMessage = `[${getTimestamp()}] ERROR: ${message}${
    error ? ` - ${error.message}` : ""
  }\n`;
  fs.appendFileSync(errorLogPath, logMessage);
  console.error(logMessage);
};


const infoLogger = (message) => {
  const logMessage = `[${getTimestamp()}] INFO: ${message}\n`;
  const infoLogPath = path.join(logsDir, "info.log");
  fs.appendFileSync(infoLogPath, logMessage);
  console.log(logMessage);
};


const dbLogger = (message) => {
  const logMessage = `[${getTimestamp()}] DB: ${message}\n`;
  const dbLogPath = path.join(logsDir, "database.log");
  fs.appendFileSync(dbLogPath, logMessage);
  console.log(logMessage);
};


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
