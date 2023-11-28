import { Router } from "express";
import {
  getAllHotelRoomBookings,
  createHotelRoomBooking,
  updateHotelRoomBooking,
  deleteHotelRoomBooking,
  getHotelRoomBookingByUserId,
  getHotelRoomBookingByVendorId,
  getSpecificHotelRoomBookingForVendor,
  unbookHotelRoom,
} from "../../controllers/hotelRoomBookingController.js";
import { checkUserAuth, checkVendorAuth } from "../middleware/auth.js";

const router = Router();

// @desc    Get all hotel room bookings
// @route   GET /api/v1/tripadvisor/hotelRoomBookings
// @access  Public
router.get("/", getAllHotelRoomBookings);

// @desc    Get hotel room booking by user id
// @route   GET /api/v1/tripadvisor/hotelRoomBookings/user/:id
// @access  Private/User
router.get("/user/:id", checkUserAuth, getHotelRoomBookingByUserId);

// @desc    Get hotel room booking by vendor id
// @route   GET /api/v1/tripadvisor/hotelRoomBookings/vendor/:id
// @access  Private/Vendor
router.get("/vendor/:id", checkVendorAuth, getHotelRoomBookingByVendorId);

// @desc    Get specific hotel room booking for vendor
// @route   GET /api/v1/tripadvisor/hotelRoomBookings/vendor/:id/:bookId
// @access  Private/Vendor
router.get(
  "/vendor/:id/:bookId",
  checkVendorAuth,
  getSpecificHotelRoomBookingForVendor
);

// @desc    Create hotel room booking
// @route   POST /api/v1/tripadvisor/hotelRoomBookings
// @access  Private/User
router.post("/", checkUserAuth, createHotelRoomBooking);

// @desc    Update hotel room booking
// @route   PUT /api/v1/tripadvisor/hotelRoomBookings/:id
// @access  Private/Vendor
router.put("/:id", checkVendorAuth, updateHotelRoomBooking);

// @desc    Delete hotel room booking
// @route   DELETE /api/v1/tripadvisor/hotelRoomBookings/:id
// @access  Private/Vendor
router.delete("/:id", checkVendorAuth, deleteHotelRoomBooking);

// @desc    Unbook hotel room
// @route   PUT /api/v1/tripadvisor/hotelRoomBookings/:id/unbook
// @access  Private/User
router.put("/:id/unbook", checkVendorAuth, unbookHotelRoom);

export default router;
