import DOMPurify from "dompurify";

export const sanitizeHtml = (dirty, options = {}) => {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }

  const defaultOptions = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  const config = { ...defaultOptions, ...options };

  return DOMPurify.sanitize(dirty, config);
};

/**
 * Sanitize plain text (strips all HTML)
 * @param {string} text - The text to sanitize
 * @returns {string} Plain text with HTML removed
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Convert relative image paths to full backend URLs
 * @param {string} imagePath - The image path (relative or absolute)
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn("getImageUrl: No image path provided");
    return "https://via.placeholder.com/300x300";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const baseUrl = API_URL.replace(/\/api$/, "");

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  const fullUrl = `${baseUrl}${normalizedPath}`;

  console.log("Image URL conversion:", {
    input: imagePath,
    baseUrl,
    output: fullUrl,
  });

  return fullUrl;
};
