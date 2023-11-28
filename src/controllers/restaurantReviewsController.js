import pool from "../config/dbConfig.js";
import restaurantReviewsQueries from "../queries/restaurantReviewsQueries.js";

// @desc    Get all restaurant reviews
// @route   GET /api/v1/tripadvisor/restaurant-reviews
// @access  Public
const getAllRestaurantReviews = async (req, res) => {
  try {
    const { rows } = await pool.query(
      restaurantReviewsQueries.getAllRestaurantReviews
    );
    res.status(200).json({ count: rows.length, restaurantReviews: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get reviews for a specific restaurant
// @route   GET /api/v1/tripadvisor/restaurant-reviews/:restaurantId
// @access  Public
const getRestaurantReviewsByRestaurantId = async (req, res) => {
  try {
    const { rows } = await pool.query(
      restaurantReviewsQueries.getRestaurantReviewsByRestaurantId,
      [req.params.restaurantId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({
          message: `No reviews found for the restaurant`,
        });
    }

    res.status(200).json({ count: rows.length, restaurantReviews: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a restaurant review
// @route   POST /api/v1/tripadvisor/restaurant-reviews
// @access  Private/User
const createRestaurantReview = async (req, res) => {
  try {
    const { rows } = await pool.query(
      restaurantReviewsQueries.createRestaurantReview,
      [req.body.restaurantId, req.body.userId, req.body.reviews]
    );
    res.status(201).json({ restaurantReview: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a restaurant review
// @route   PUT /api/v1/tripadvisor/restaurant-reviews/:restaurantReviewId
// @access  Private/User
const updateRestaurantReview = async (req, res) => {
  try {
    const { reviews } = req.body;
    const { rows } = await pool.query(
      restaurantReviewsQueries.updateRestaurantReview,
      [reviews, req.params.restaurantReviewId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({
          message: `No review found with id ${req.params.restaurantReviewId}`,
        });
    }

    res.status(200).json({ restaurantReview: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a restaurant review
// @route   DELETE /api/v1/tripadvisor/restaurant-reviews/:restaurantReviewId
// @access  Private/User
const deleteRestaurantReview = async (req, res) => {
  try {
    const { rows } = await pool.query(
      restaurantReviewsQueries.deleteRestaurantReview,
      [req.params.restaurantReviewId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Review Not found`,
      });
    }

    res
      .status(200)
      .json({
        message: `Review deleted successfully`,
        deleteRestaurantReview: rows[0],
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllRestaurantReviews,
  getRestaurantReviewsByRestaurantId,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
};
