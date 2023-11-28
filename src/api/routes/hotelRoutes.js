import { Router } from "express";
import multer from "multer";
import { checkVendorAuth } from "../middleware/auth.js";

import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  updateHotelPictures,
  deleteHotelPictures,
} from "../../controllers/hotelController.js";

const router = Router();

// @desc Get all hotels
// @route GET /api/v1/tripadvisor/hotels
// @access Public
router.get("/", getHotels);

// @desc Get a hotel
// @route GET /api/v1/tripadvisor/hotels/:id
// @access Public
router.get("/:id", getHotel);

// @desc Create a hotel
// @route POST /api/v1/tripadvisor/hotels
// @access Private/Vendor
router.post("/", checkVendorAuth, createHotel);

// @desc Update a hotel
// @route PUT /api/v1/tripadvisor/hotels/:id
// @access Private/Vendor
router.put("/:id", checkVendorAuth, updateHotel);

// @desc Add/Update hotel pictures
// @route PUT /api/v1/tripadvisor/hotels/pictures/:id
// @access Private/Vendor
const upload = multer({
  storage: multer.memoryStorage(),
});

router.put(
  "/pictures/:id",
  checkVendorAuth,
  upload.array("pictures"),
  updateHotelPictures
);

// @desc Delete hotel pictures
// @route DELETE /api/v1/tripadvisor/hotels/pictures/:id
// @access Private/Vendor
router.delete("/pictures/:id", checkVendorAuth, deleteHotelPictures);

// @desc Delete a hotel
// @route DELETE /api/v1/tripadvisor/hotels/:id
// @access Private/Vendor
router.delete("/:id", checkVendorAuth, deleteHotel);

export default router;
