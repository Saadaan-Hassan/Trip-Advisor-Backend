import pool from "../config/dbConfig.js";
import vendorQueries from "../queries/vendorQueries.js";
import userQueries from "../queries/userQueries.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// @desc: Get all vendors
// @route: GET /api/v1/tripadvisor/vendors/
// @access: Public
const getVendors = async (req, res) => {
  try {
    const { rows } = await pool.query(vendorQueries.getAllVendors);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc: Get vendor by id
// @route: GET /api/v1/tripadvisor/vendors/:id
// @access: Public
const getVendorById = async (req, res) => {
  try {
    const { rows } = await pool.query(vendorQueries.getVendorById, [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc: Create new vendor
// @route: POST /api/v1/tripadvisor/vendors/signup
// @access: Private/Vendor
const signupVendor = async (req, res) => {
  try {
    const { userId, cnic } = req.body;

    const user = await pool.query(userQueries.getUserById, [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const newVendor = await pool.query(vendorQueries.createVendor, [
      userId,
      cnic,
    ]);

    if (newVendor.rowCount === 0) {
      return res.status(400).json({ message: "Vendor not created" });
    }

    if (newVendor.rowCount === 1) {
      const token = jwt.sign({ userId }, process.env.JWT_VENDOR_KEY, {
        expiresIn: "1h",
      });
    }

    return res.status(201).json({
      message: "Vendor created successfully",
      vendor: newVendor.rows,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Vendor already exists" });
    }
    
    res.status(500).json({ error: error.message });
  }
};

// @desc: Login vendor
// @route: POST /api/v1/tripadvisor/vendors/login
// @access: Private/Vendor
const loginVendor = async (req, res) => {
  try {
    const { userId, cnic } = req.body;

    const user = await pool.query(userQueries.getUserById, [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const vendor = await pool.query(vendorQueries.getVendorByUserId, [userId]);

    if (vendor.rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.rows[0].cnicnumber !== cnic) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    jwt.sign(
      { userId },
      process.env.JWT_VENDOR_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) return res.status(401).send("Authentication failed");
        res.status(200).json({ message: "Authentication successful", token });
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc: Update vendor
// @route: PUT /api/v1/tripadvisor/vendors/:id
// @access: Private/Vendor
const updateVendor = (req, res) => {};

// @desc: Deactivate vendor
// @route: DELETE /api/v1/tripadvisor/vendors/:id
// @access: Private
const deactivateVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(vendorQueries.deactivateVendor, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res
      .status(200)
      .json({ message: "Vendor deactivated successfully", vendor: rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc: Reactivate vendor
// @route: PUT /api/v1/tripadvisor/vendors/:id
// @access: Private/Vendor
const reactivateVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(vendorQueries.reactivateVendor, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res
      .status(200)
      .json({ message: "Vendor reactivated successfully", vendor: rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc: Delete vendor
// @route: DELETE /api/v1/tripadvisor/vendors/:id
// @access: Private/Vendor
const deleteVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(vendorQueries.deleteVendor, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res
      .status(200)
      .json({ message: "Vendor deleted successfully", vendor: rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default {
  getVendors,
  getVendorById,
  signupVendor,
  loginVendor,
  updateVendor,
  deactivateVendor,
  reactivateVendor,
  deleteVendor,
};
