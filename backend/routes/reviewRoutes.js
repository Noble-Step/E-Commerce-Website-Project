const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getRecentReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateReviewCreation,
  validateReviewUpdate,
  validateReviewId,
} = require("../middleware/validationMiddleware");

router.route("/").post(protect, validateReviewCreation, createReview);

router.route("/product/:productId").get(getProductReviews);

router.route("/recent").get(getRecentReviews);

router
  .route("/:id")
  .put(protect, validateReviewId, validateReviewUpdate, updateReview)
  .delete(protect, validateReviewId, deleteReview);

module.exports = router;
