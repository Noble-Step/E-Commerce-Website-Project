const { body, param, validationResult, query } = require("express-validator");


const stripHtml = (value) => {
  if (typeof value !== "string") return value;
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
};


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateUserRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("firstName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateUserProfileUpdate = [
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("firstName")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[0-9\s\-()]{7,20}$/)
    .withMessage(
      "Phone number must be 7-20 digits and may include +, spaces, hyphen, or parentheses"
    ),
  body("address")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        return value.trim().length >= 5;
      }
      return typeof value === "object" && value !== null;
    })
    .withMessage("Address must be a string or object"),
  body("address.street")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage("Street address must be at least 5 characters"),
  body("address.city")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),
  body("address.state")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),
  body("address.zip")
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9\s-]{3,10}$/)
    .withMessage("ZIP/Postal code must be 3-10 characters"),
  body("address.country")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  handleValidationErrors,
];

const validateProductCreation = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),
  body("description")
    .trim()
    .customSanitizer(stripHtml)
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("images").custom((value, { req }) => {
    if (req.files && req.files.length > 0) return true;
    if (value && Array.isArray(value) && value.length > 0) return true;
    throw new Error("At least one image is required");
  }),
  body("sizes")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch (e) {
        }
      }
      throw new Error("Sizes must be an array");
    }),
  handleValidationErrors,
];

const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),
  body("description")
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("images")
    .optional()
    .custom((value, { req }) => {
      if (req.files && req.files.length > 0) return true;
      if (!value) return true; 
      if (Array.isArray(value) && value.length > 0) return true;
      return true;
    }),
  body("sizes")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch (e) {
        }
      }
      throw new Error("Sizes must be an array");
    }),
  handleValidationErrors,
];

const validateProductId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid product ID"),
  handleValidationErrors,
];

const validateReviewCreation = [
  body("productId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid product ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Review title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("comment")
    .trim()
    .customSanitizer(stripHtml)
    .notEmpty()
    .withMessage("Review comment is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters"),
  handleValidationErrors,
];

const validateReviewUpdate = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("comment")
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters"),
  handleValidationErrors,
];

const validateReviewId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid review ID"),
  handleValidationErrors,
];

const validateCartAddition = [
  body("productId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid product ID"),
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  body("size").optional().trim().notEmpty().withMessage("Size cannot be empty"),
  handleValidationErrors,
];

const validateCartUpdate = [
  param("itemId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid cart item ID"),
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  handleValidationErrors,
];

const validateOrderCreation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.productId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid product ID in order items"),
  body("items.*.quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Item quantity must be between 1 and 100"),
  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
  body("shippingAddress")
    .custom((value) => typeof value === "object" && value !== null)
    .withMessage("Shipping address is required"),
  body("shippingAddress.street")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Street address must be at least 3 characters"),
  body("shippingAddress.city")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),
  body("shippingAddress.state")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),
  body("shippingAddress.zip")
    .trim()
    .matches(/^[A-Za-z0-9\s-]{3,10}$/)
    .withMessage("ZIP/Postal code must be 3-10 characters"),
  body("shippingAddress.country")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),
  body("paymentDetails")
    .custom((value) => typeof value === "object" && value !== null)
    .withMessage("Payment details are required"),
  body("paymentDetails.method")
    .isIn(["card", "digitalWallet", "bankTransfer", "cashOnDelivery"])
    .withMessage("Invalid payment method"),
  body("paymentDetails.method").custom((method, { req }) => {
    const paymentDetails = req.body.paymentDetails || {};

    if (method === "card") {
      if (!paymentDetails.cardNumber || !paymentDetails.cardNumber.trim()) {
        throw new Error("Card number is required for card payments");
      }
      if (!paymentDetails.cvv || !paymentDetails.cvv.trim()) {
        throw new Error("CVV is required for card payments");
      }
      if (!paymentDetails.expiry || !paymentDetails.expiry.trim()) {
        throw new Error("Expiry date is required for card payments");
      }
      if (!paymentDetails.cardName || !paymentDetails.cardName.trim()) {
        throw new Error("Cardholder name is required for card payments");
      }
    } else if (method === "digitalWallet") {
      if (!paymentDetails.walletType || !paymentDetails.walletType.trim()) {
        throw new Error("Wallet type is required for digital wallet payments");
      }
      if (!paymentDetails.walletEmail || !paymentDetails.walletEmail.trim()) {
        throw new Error("Email is required for digital wallet payments");
      }
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(paymentDetails.walletEmail)) {
        throw new Error("Valid email is required for digital wallet payments");
      }
    } else if (method === "bankTransfer") {
      if (!paymentDetails.bankName || !paymentDetails.bankName.trim()) {
        throw new Error("Bank name is required for bank transfer payments");
      }
      if (
        !paymentDetails.accountNumber ||
        !paymentDetails.accountNumber.trim()
      ) {
        throw new Error(
          "Account number is required for bank transfer payments"
        );
      }
      if (
        !paymentDetails.routingNumber ||
        !paymentDetails.routingNumber.trim()
      ) {
        throw new Error(
          "Routing number is required for bank transfer payments"
        );
      }
      if (!/^\d{9}$/.test(paymentDetails.routingNumber.trim())) {
        throw new Error("Routing number must be exactly 9 digits");
      }
    }
    return true;
  }),
  handleValidationErrors,
];

const validateOrderId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid order ID"),
  handleValidationErrors,
];

const validateProductQuery = [
  query("search")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Search term too long"),
  query("category")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min price must be a positive number"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be a positive number"),
  query("sort")
    .optional()
    .isIn(["price", "-price", "-createdAt", "rating"])
    .withMessage("Invalid sort option"),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validateProductCreation,
  validateProductUpdate,
  validateProductId,
  validateReviewCreation,
  validateReviewUpdate,
  validateReviewId,
  validateCartAddition,
  validateCartUpdate,
  validateOrderCreation,
  validateOrderId,
  validateProductQuery,
  handleValidationErrors,
};
