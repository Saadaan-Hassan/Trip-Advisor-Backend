import { Router } from "express";
import restaurantReviews from "../../controllers/restaurantReviewsController.js";
import { checkUserAuth } from "../middleware/auth.js";

const router = Router();

// @desc    Get all restaurant reviews
// @route   GET /api/v1/tripadvisor/restaurant-reviews
// @access  Public
router.get("/", restaurantReviews.getAllRestaurantReviews);

// @desc    Get reviews for a specific restaurant
// @route   GET /api/v1/tripadvisor/restaurant-reviews/:restaurantId
// @access  Public
router.get(
  "/:restaurantId",
  restaurantReviews.getRestaurantReviewsByRestaurantId
);

// @desc    Create a restaurant review
// @route   POST /api/v1/tripadvisor/restaurant-reviews
// @access  Private/User
router.post("/", checkUserAuth, restaurantReviews.createRestaurantReview);

// @desc    Update a restaurant review
// @route   PUT /api/v1/tripadvisor/restaurant-reviews/:restaurantReviewId
// @access  Private/User
router.put(
  "/:restaurantReviewId",
  checkUserAuth,
  restaurantReviews.updateRestaurantReview
);

// @desc    Delete a restaurant review
// @route   DELETE /api/v1/tripadvisor/restaurant-reviews/:restaurantReviewId
// @access  Private/User
router.delete(
  "/:restaurantReviewId",
  checkUserAuth,
  restaurantReviews.deleteRestaurantReview
);

export default router;
