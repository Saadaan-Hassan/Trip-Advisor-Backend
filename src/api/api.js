import { Router } from "express";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import hotelRoomRoutes from "./routes/roomRoutes.js";
import hotelRoomBookingRoutes from "./routes/hotelRoomBookingRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import restaurantResrvationRoutes from "./routes/restaurantReservationRoutes.js";
import dishesRoutes from "./routes/dishesRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import hotelReviews from "./routes/hotelReviewsRoutes.js"
import restaurantReviews from "./routes/restaurantReviewsRoutes.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/vendors", vendorRoutes);
router.use("/hotels", hotelRoutes);
router.use("/hotel-rooms", hotelRoomRoutes);
router.use("/hotel-room-bookings", hotelRoomBookingRoutes);
router.use("/hotel-reviews", hotelReviews)
router.use("/restaurants", restaurantRoutes);
router.use("/dishes", dishesRoutes);
router.use("/restaurant-reservations", restaurantResrvationRoutes);
router.use("/restaurant-reviews", restaurantReviews);
router.use("/payments", paymentRoutes);

export default router;
