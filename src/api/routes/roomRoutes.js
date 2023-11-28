import { Router } from "express";
import roomController from "../../controllers/roomController.js";
import { checkVendorAuth } from "../middleware/auth.js";
const router = Router();

// @desc Get all rooms
// @route GET /api/v1/tripadvisor/hotelrooms
// @access Public
router.get("/", roomController.getAllRooms);

// @desc Get room by id
// @route GET /api/v1/tripadvisor/hotelrooms/:id
// @access Public
router.get("/:id", roomController.getRoomById);

// @desc Create new room
// @route POST /api/v1/tripadvisor/hotelrooms
// @access Private/Vendor
router.post("/", checkVendorAuth, roomController.createRoom);

// @desc Update room
// @route PUT /api/v1/tripadvisor/hotelrooms/:id
// @access Private/Vendor
router.put("/:id", checkVendorAuth, roomController.updateRoom);

// @desc Delete room
// @route DELETE /api/v1/tripadvisor/hotelrooms/:id
// @access Private/Vendor
router.delete("/:id", checkVendorAuth, roomController.deleteRoom);

export default router;
