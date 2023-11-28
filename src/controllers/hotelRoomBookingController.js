import pool from "../config/dbConfig.js";
import hotelRoomBookingQueries from "../queries/hotelRoomBookingQueries.js";
import userQueries from "../queries/userQueries.js";
import vendorQueries from "../queries/vendorQueries.js";

// @desc    Get all hotel room bookings
// @route   GET /api/tripadvisor/hotelRoomBookings
// @access  Public
const getAllHotelRoomBookings = async (req, res) => {
  try {
    const result = await pool.query(
      hotelRoomBookingQueries.getAllHotelRoomBookings
    );
    res
      .status(200)
      .json({ count: result.rowCount, hotelRoomBookings: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Get hotel room booking by user id
// @route   GET /api/tripadvisor/hotelRoomBookings/user/:id
// @access  Private/User
const getHotelRoomBookingByUserId = async (req, res) => {
  try {
    const userResult = await pool.query(userQueries.getUserById, [
      req.params.id,
    ]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hotelResult = await pool.query(
      hotelRoomBookingQueries.getHotelRoomBookingByUserId,
      [req.params.id]
    );

    if (hotelResult.rowCount === 0) {
      return res.status(404).json({ message: "Hotel room booking not found" });
    }

    res.status(200).json({
      count: hotelResult.rowCount,
      hotelRoomBookings: hotelResult.rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Get hotel room booking by vendor id
// @route   GET /api/tripadvisor/hotelRoomBookings/vendor/:id
// @access  Private/Vendor
const getHotelRoomBookingByVendorId = async (req, res) => {
  try {
    const userResult = await pool.query(vendorQueries.getVendorById, [
      req.params.id,
    ]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const hotelResult = await pool.query(
      hotelRoomBookingQueries.getHotelRoomBookingByVendorId,
      [req.params.id]
    );

    res.status(200).json({
      count: hotelResult.rowCount,
      hotelRoomBookings: hotelResult.rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Get specific hotel room booking for vendor
// @route   GET /api/tripadvisor/hotelRoomBookings/vendor/:id/:bookId
// @access  Private/Vendor
const getSpecificHotelRoomBookingForVendor = async (req, res) => {
  try {
    const result = await pool.query(
      hotelRoomBookingQueries.getSpecificHotelRoomBookingForVendor,
      [req.params.bookId, req.params.id]
    );
    res
      .status(200)
      .json({ count: result.rowCount, hotelRoomBookings: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Create hotel room booking
// @route   POST /api/tripadvisor/hotelRoomBookings
// @access  Private/User
const createHotelRoomBooking = async (req, res) => {
  try {
    const {
      hotelRoomId,
      userId,
      paymentType,
      BookingstartTime,
      bookingTimeEnd,
    } = req.body;

    const userResult = await pool.query(userQueries.getUserById, [userId]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hotelRoomResult = await pool.query(
      hotelRoomBookingQueries.getResvStatus,
      [hotelRoomId]
    );

    if (hotelRoomResult.rowCount === 0) {
      return res.status(404).json({ message: "Hotel room not found" });
    }

    if (hotelRoomResult.rows[0].resvstatus === true) {
      return res.status(404).json({ message: "Hotel room is already booked" });
    }

    const result = await pool.query(
      hotelRoomBookingQueries.createHotelRoomBooking,
      [hotelRoomId, userId, paymentType, BookingstartTime, bookingTimeEnd]
    );
    const roomStatus = await pool.query(
      hotelRoomBookingQueries.updateResvStatus,
      [true, hotelRoomId]
    );
    res.status(201).json({
      hotelRoomBooking: result.rows[0],
      roomStatus: roomStatus.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Update hotel room booking
// @route   PUT /api/tripadvisor/hotelRoomBookings/:id
// @access  Private/Vendor
const updateHotelRoomBooking = async (req, res) => {
  try {
    const {
      hotelRoomId,
      userId,
      paymentType,
      BookingstartTime,
      bookingTimeEnd,
    } = req.body;

    const oldData = await pool.query(
      hotelRoomBookingQueries.getHotelRoomBookingById,
      [req.params.id]
    );

    if (oldData.rowCount === 0) {
      return res.status(404).json({ message: "Hotel room booking not found" });
    }

    const updateData = {
      hotelRoomId: hotelRoomId || oldData.rows[0].hotelroomid,
      userId: userId || oldData.rows[0].userid,
      paymentType: paymentType || oldData.rows[0].paymenttype,
      BookingstartTime: BookingstartTime || oldData.rows[0].bookingstarttime,
      bookingTimeEnd: bookingTimeEnd || oldData.rows[0].bookingtimeend,
    };

    const userResult = await pool.query(userQueries.getUserById, [
      updateData.userId,
    ]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await pool.query(
      hotelRoomBookingQueries.updateHotelRoomBooking,
      [
        updateData.hotelRoomId,
        updateData.userId,
        updateData.paymentType,
        updateData.BookingstartTime,
        updateData.bookingTimeEnd,
        req.params.id,
      ]
    );
    res.status(200).json({ hotelRoomBooking: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Delete hotel room booking
// @route   DELETE /api/tripadvisor/hotelRoomBookings/:id
// @access  Private/Vendor
const deleteHotelRoomBooking = async (req, res) => {
  try {
    const result = await pool.query(
      hotelRoomBookingQueries.deleteHotelRoomBooking,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Hotel room booking not found" });
    }

    res.status(200).json({
      result: result.rows[0],
      message: "Hotel room booking deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Unbook hotel room
// @route   PUT /api/tripadvisor/hotelRoomBookings/:id/unbook
// @access  Private/User
const unbookHotelRoom = async (req, res) => {
  try {
    const result = await pool.query(
      hotelRoomBookingQueries.getHotelRoomBookingById,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Hotel room booking not found" });
    }

    const roomStatus = await pool.query(
      hotelRoomBookingQueries.updateResvStatus,
      [false, result.rows[0].hotelroomid]
    );

    res.status(200).json({
      message: "Hotel room unbooked successfully",
      roomStatus: roomStatus.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export {
  getAllHotelRoomBookings,
  createHotelRoomBooking,
  updateHotelRoomBooking,
  deleteHotelRoomBooking,
  getHotelRoomBookingByUserId,
  getHotelRoomBookingByVendorId,
  getSpecificHotelRoomBookingForVendor,
  unbookHotelRoom,
};
