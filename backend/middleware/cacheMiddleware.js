const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 300, 
  checkperiod: 60, 
  useClones: false, 
});

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
const getCacheKey = (req) => {
  const baseKey = `${req.method}:${req.originalUrl}`;
  const queryString = Object.keys(req.query)
    .sort()
    .map((key) => `${key}=${req.query[key]}`)
    .join("&");
  return queryString ? `${baseKey}?${queryString}` : baseKey;
};

/**
 * Generic caching middleware
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = getCacheKey(req);
    const cachedData = cache.get(key);

    if (cachedData) {
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
};


const clearProductCache = () => {
  const keys = cache.keys();
  const productKeys = keys.filter(
    (key) =>
      key.includes("/api/products") ||
      key.includes("GET:/api/products")
  );
  if (productKeys.length > 0) {
    cache.del(productKeys);
  }
};

/**
 * Clear cache for a specific product by ID
 * @param {string} productId - Product ID
 */
const clearProductByIdCache = (productId) => {
  const keys = cache.keys();
  const productKeys = keys.filter((key) => key.includes(`/api/products/${productId}`));
  if (productKeys.length > 0) {
    cache.del(productKeys);
  }
};


const clearAllCache = () => {
  cache.flushAll();
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
const getCacheStats = () => {
  return cache.getStats();
};

module.exports = {
  cacheMiddleware,
  getCacheKey,
  clearProductCache,
  clearProductByIdCache,
  clearAllCache,
  getCacheStats,
  cache, 
};

