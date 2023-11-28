import { Router } from "express";
import { getAllPayments } from "../../controllers/paymentController.js";

const router = Router();

// @desc    Get all payments
// @route   GET /api/v1/tripadvisor/payments
// @access  Public
router.get("/", getAllPayments);

export default router;
