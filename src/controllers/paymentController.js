import pool from "../config/dbConfig.js";
import paymentQueries from "../queries/paymentQueries.js";

// @desc    Get all payments
// @route   GET /api/v1/tripadvisor/payments
// @access  Public
const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(paymentQueries.getAllPayments);
    res.status(200).json({ count: result.rowCount, payments: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

export { getAllPayments };
