const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "PORT", "NODE_ENV"];

const optionalEnvVars = ["FRONTEND_URL"];

const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  optionalEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please set them in your .env file before starting the server.`
    );
  }

  if (warnings.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set: ${warnings.join(", ")}`
    );
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "⚠️  JWT_SECRET should be at least 32 characters for security"
    );
  }

  // ✅ FIX: Trim NODE_ENV to remove whitespace
  const nodeEnv = process.env.NODE_ENV?.trim();
  const validEnvs = ["development", "production", "test"];
  if (!validEnvs.includes(nodeEnv)) {
    console.warn(
      `⚠️  NODE_ENV should be one of: ${validEnvs.join(", ")}. Got: ${nodeEnv}`
    );
  }

  // ✅ FIX: Set trimmed NODE_ENV back
  if (nodeEnv) {
    process.env.NODE_ENV = nodeEnv;
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
