import pool from "../config/dbConfig.js";
import hotelReviewsQueries from "../queries/hotelReviewsQueries.js";

// @desc    Get all hotel reviews
// @route   GET /api/v1/tripadvisor/hotel-reviews
// @access  Public
const getAllHotelsReviews = async (req, res) => {
  try {
    const { rows } = await pool.query(hotelReviewsQueries.getAllHotelReviews);
    res.status(200).json({ count: rows.length, hotelReviews: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get reviews for a specific hotel
// @route   GET /api/v1/tripadvisor/hotel-reviews/:hotelId
// @access  Public
const getHotelReviewsByHotelId = async (req, res) => {
  try {
    const { rows } = await pool.query(
      hotelReviewsQueries.getHotelReviewsByHotelId,
      [req.params.hotelId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `No reviews found for hotel ${req.params.hotelId}` });
    }

    res.status(200).json({ count: rows.length, hotelReviews: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a hotel review
// @route   POST /api/v1/tripadvisor/hotel-reviews
// @access  Private/User
const createHotelReview = async (req, res) => {
  try {
    const { rows } = await pool.query(hotelReviewsQueries.createHotelReview, [
      req.body.hotelId,
      req.body.userId,
      req.body.reviews,
    ]);
    res.status(201).json({ hotelReview: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a hotel review
// @route   PUT /api/v1/tripadvisor/hotel-reviews/:hotelReviewId
// @access  Private/User
const updateHotelReview = async (req, res) => {
  try {
    const { reviews } = req.body;

    const oldReview = await pool.query(hotelReviewsQueries.getHotelReviewById, [
      req.params.hotelReviewId,
    ]);

    const { rows } = await pool.query(hotelReviewsQueries.updateHotelReview, [
      reviews || oldReview.rows[0].reviews,
      req.params.hotelReviewId,
    ]);
    res.status(200).json({ updatedHotelReview: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a hotel review
// @route   DELETE /api/v1/tripadvisor/hotel-reviews/:hotelReviewId
// @access  Private/User
const deleteHotelReview = async (req, res) => {
  try {
    const { rows } = await pool.query(hotelReviewsQueries.deleteHotelReview, [
      req.params.hotelReviewId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `No review found with id ${req.params.hotelReviewId}`,
      });
    }

    res.status(200).json({ deletedHotelReview: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllHotelsReviews,
  getHotelReviewsByHotelId,
  createHotelReview,
  updateHotelReview,
  deleteHotelReview,
};
