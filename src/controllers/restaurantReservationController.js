import pool from "../config/dbConfig.js";
import restaurantReservationQueries from "../queries/restaurantReservationQueries.js";
import userQueries from "../queries/userQueries.js";
import vendorQueries from "../queries/vendorQueries.js";
import restaurantQueries from "../queries/restaurantQueries.js";

// @desc    Get all restaurant reservations
// @route   GET /api/v1/tripadvisor/restaurantReservations
// @access  Public
const getAllRestaurantReservations = async (req, res) => {
  try {
    const allRestaurantReservations = await pool.query(
      restaurantReservationQueries.getAllRestaurantReservations
    );

    res.status(200).json({
      count: allRestaurantReservations.rowCount,
      restaurantReservations: allRestaurantReservations.rows,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// @desc    Get restaurant reservation by user id
// @route   GET /api/v1/tripadvisor/restaurantReservations/user/:id
// @access  Private/User
const getRestaurantReservationByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(userQueries.getUserById, [id]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurantReservations = await pool.query(
      restaurantReservationQueries.getRestaurantReservationByUserId,
      [id]
    );

    res.status(200).json({
      count: restaurantReservations.rowCount,
      restaurantReservations: restaurantReservations.rows,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// @desc    Get restaurant reservation by vendor id
// @route   GET /api/v1/tripadvisor/restaurantReservations/vendor/:id
// @access  Private/Vendor
const getRestaurantReservationByVendorId = async (req, res) => {
  try {
    const { id } = req.params;

    const vendorResult = await pool.query(vendorQueries.getVendorById, [id]);

    if (vendorResult.rowCount === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const restaurantReservations = await pool.query(
      restaurantReservationQueries.getRestaurantReservationByVendorID,
      [id]
    );

    res.status(200).json({
      count: restaurantReservations.rowCount,
      restaurantReservations: restaurantReservations.rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Create restaurant reservation
// @route   POST /api/v1/tripadvisor/restaurantReservations
// @access  Private/User
const createRestaurantReservation = async (req, res) => {
  try {
    const {
      userId,
      restaurantId,
      paymentType,
      bookingTimeStart,
      bookingTimeEnd,
    } = req.body;

    const userResult = await pool.query(userQueries.getUserById, [userId]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurantResult = await pool.query(
      restaurantQueries.getRestaurantById,
      [restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newRestaurantReservation = await pool.query(
      restaurantReservationQueries.createRestaurantReservation,
      [restaurantId, userId, paymentType, bookingTimeStart, bookingTimeEnd]
    );

    res.status(201).json({
      message: "Restaurant reservation created successfully",
      newRestaurantReservation: newRestaurantReservation.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Update restaurant reservation
// @route   PUT /api/v1/tripadvisor/restaurantReservations/:id
// @access  Private/Vendor
const updateRestaurantReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      restaurantId,
      paymentType,
      bookingTimeStart,
      bookingTimeEnd,
    } = req.body;

    const oldData = await pool.query(
      restaurantReservationQueries.getRestaurantReservationById,
      [id]
    );

    if (oldData.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Restaurant reservation not found" });
    }

    const updateData = {
      userId: userId || oldData.rows[0].userid,
      restaurantId: restaurantId || oldData.rows[0].resturantid,
      paymentType: paymentType || oldData.rows[0].paymenttype,
      bookingTimeStart: bookingTimeStart || oldData.rows[0].bookingtimestart,
      bookingTimeEnd: bookingTimeEnd || oldData.rows[0].bookingtimeend,
    };

    const userResult = await pool.query(userQueries.getUserById, [
      updateData.userId,
    ]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurantResult = await pool.query(
      restaurantQueries.getRestaurantById,
      [updateData.restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const result = await pool.query(
      restaurantReservationQueries.updateRestaurantReservation,
      [
        updateData.restaurantId,
        updateData.userId,
        updateData.paymentType,
        updateData.bookingTimeStart,
        updateData.bookingTimeEnd,
        id,
      ]
    );

    res.status(200).json({
      updatedRestaurantReservation: result.rows[0],
      message: "Restaurant reservation updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Delete restaurant reservation
// @route   DELETE /api/v1/tripadvisor/restaurantReservations/:id
// @access  Private/Vendor
const deleteRestaurantReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      restaurantReservationQueries.deleteRestaurantReservation,
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Restaurant reservation not found" });
    }

    res.status(200).json({
      deletedRestaurantReservation: result.rows[0],
      message: "Restaurant reservation deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export default {
  getAllRestaurantReservations,
  getRestaurantReservationByUserId,
  getRestaurantReservationByVendorId,
  createRestaurantReservation,
  updateRestaurantReservation,
  deleteRestaurantReservation,
};
