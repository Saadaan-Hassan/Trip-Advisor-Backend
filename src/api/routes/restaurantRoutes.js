import { Router } from "express";
import multer from "multer";
import { checkVendorAuth } from "../middleware/auth.js";
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  updateRestaurantPictures,
  deleteRestaurant,
} from "../../controllers/restaurantController.js";

const router = Router();

// @desc Get all restaurants
// @route GET /api/v1/tripadvisor/restaurants
// @access Public
router.get("/", getRestaurants);

// @desc Get a restaurant
// @route GET /api/v1/tripadvisor/restaurants/:id
// @access Public
router.get("/:id", getRestaurant);

// @desc Create a restaurant
// @route POST /api/v1/tripadvisor/restaurants
// @access Private/Vendor
router.post("/", checkVendorAuth, createRestaurant);

// @desc Update a restaurant
// @route PUT /api/v1/tripadvisor/restaurants/:id
// @access Private/Vendor
router.put("/:id", checkVendorAuth, updateRestaurant);

// @desc Add/Update restaurant pictures
// @route PUT /api/v1/tripadvisor/restaurants/pictures/:id
// @access Private/Vendor
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

router.put(
  "/pictures/:id",
  checkVendorAuth,
  upload.array("pictures"),
  updateRestaurantPictures
);

// @desc Delete a restaurant
// @route DELETE /api/v1/tripadvisor/restaurants/:id
// @access Private/Vendor
router.delete("/:id", checkVendorAuth, deleteRestaurant);

export default router;
