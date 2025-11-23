/**
 * Environment Variable Validation
 * Ensures all required environment variables are set on startup
 */

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "PORT", "NODE_ENV"];

const optionalEnvVars = ["FRONTEND_URL"];

/**
 * Validate all required environment variables
 * Throws error if any required variables are missing
 */
const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  // Check optional variables
  optionalEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  });

  // Throw error if required variables missing
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please set them in your .env file before starting the server.`
    );
  }

  // Log warnings for optional variables
  if (warnings.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set: ${warnings.join(", ")}`
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "⚠️  JWT_SECRET should be at least 32 characters for security"
    );
  }

  // Validate NODE_ENV
  const validEnvs = ["development", "production", "test"];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    console.warn(
      `⚠️  NODE_ENV should be one of: ${validEnvs.join(", ")}. Got: ${
        process.env.NODE_ENV
      }`
    );
  }

  return {
    valid: true,
    missingCount: missing.length,
    warningCount: warnings.length,
  };
};

module.exports = {
  validateEnvironment,
};
