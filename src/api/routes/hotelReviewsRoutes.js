import { Router } from "express";
import hotelReviews from "../../controllers/hotelReviewsController.js";
import { checkUserAuth } from "../middleware/auth.js";

const router = Router();

// @desc    Get all hotel reviews
// @route   GET /api/v1/tripadvisor/hotel-reviews
// @access  Public
router.get("/", hotelReviews.getAllHotelsReviews);

// @desc    Get reviews for a specific hotel
// @route   GET /api/v1/tripadvisor/hotel-reviews/:hotelId
// @access  Public
router.get("/:hotelId", hotelReviews.getHotelReviewsByHotelId);

// @desc    Create a hotel review
// @route   POST /api/v1/tripadvisor/hotel-reviews
// @access  Private/User
router.post("/", checkUserAuth, hotelReviews.createHotelReview);

// @desc    Update a hotel review
// @route   PUT /api/v1/tripadvisor/hotel-reviews/:hotelReviewId
// @access  Private/User
router.put("/:hotelReviewId", checkUserAuth, hotelReviews.updateHotelReview);

// @desc    Delete a hotel review
// @route   DELETE /api/v1/tripadvisor/hotel-reviews/:hotelReviewId
// @access  Private/User
router.delete("/:hotelReviewId", checkUserAuth, hotelReviews.deleteHotelReview);

export default router;
