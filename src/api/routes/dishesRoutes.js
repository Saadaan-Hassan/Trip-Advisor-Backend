import { Router } from "express";
import {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getDishesByRestaurantId,
} from "../../controllers/dishesController.js";
import { checkVendorAuth } from "../middleware/auth.js";

const router = Router();

// @desc Get all dishes
// @route GET /api/v1/tripadvisor/dishes
// @access Public
router.get("/", getAllDishes);

// @desc Get dish by id
// @route GET /api/v1/tripadvisor/dishes/:id
// @access Public
router.get("/:id", getDishById);

// @desc Get dishes by restaurant id
// @route GET /api/v1/tripadvisor/dishes/restaurants/:id
// @access Public
router.get("/restaurants/:id", getDishesByRestaurantId);

// @desc Create dish
// @route POST /api/v1/tripadvisor/dishes
// @access Private/Vendor
router.post("/", checkVendorAuth, createDish);

// @desc Update dish
// @route PUT /api/v1/tripadvisor/dishes/:id
// @access Private/Vendor
router.put("/:id", checkVendorAuth, updateDish);

// @desc Delete dish
// @route DELETE /api/v1/tripadvisor/dishes/:id
// @access Private/Vendor
router.delete("/:id", checkVendorAuth, deleteDish);

export default router;
