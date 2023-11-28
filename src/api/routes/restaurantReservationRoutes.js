import { Router } from "express";
import { checkUserAuth, checkVendorAuth } from "../middleware/auth.js";
import restaurantReservationController from "../../controllers/restaurantReservationController.js";

const router = Router();

// @desc    Get all restaurant reservations
// @route   GET /api/v1/tripadvisor/restaurantReservations
// @access  Public
router.get("/", restaurantReservationController.getAllRestaurantReservations);

// @desc    Get restaurant reservation by user id
// @route   GET /api/v1/tripadvisor/restaurantReservations/user/:id
// @access  Private/User
router.get(
  "/user/:id",
  checkUserAuth,
  restaurantReservationController.getRestaurantReservationByUserId
);

// @desc    Get restaurant reservation by vendor id
// @route   GET /api/v1/tripadvisor/restaurantReservations/vendor/:id
// @access  Private/Vendor
router.get(
  "/vendor/:id",
  checkVendorAuth,
  restaurantReservationController.getRestaurantReservationByVendorId
);

// @desc    Create restaurant reservation
// @route   POST /api/v1/tripadvisor/restaurantReservations
// @access  Private/User
router.post(
  "/",
  checkUserAuth,
  restaurantReservationController.createRestaurantReservation
);

// @desc    Update restaurant reservation
// @route   PUT /api/v1/tripadvisor/restaurantReservations/:id
// @access  Private/Vendor
router.put(
  "/:id",
  checkVendorAuth,
  restaurantReservationController.updateRestaurantReservation
);

// @desc    Delete restaurant reservation
// @route   DELETE /api/v1/tripadvisor/restaurantReservations/:id
// @access  Private/Vendor
router.delete(
  "/:id",
  checkVendorAuth,
  restaurantReservationController.deleteRestaurantReservation
);

export default router;
