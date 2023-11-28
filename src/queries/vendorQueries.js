const getAllVendors = "SELECT * FROM vendors";
const getVendorById = "SELECT * FROM vendors WHERE vendorId = $1";
const getVendorByUserId = "SELECT * FROM vendors WHERE userId = $1";
const createVendor =
  "INSERT INTO vendors (userId, cnicNumber) VALUES ($1, $2) RETURNING *";
const updateVendor =
  "UPDATE vendors SET cnicNumber = $1 WHERE vendorId = $2 RETURNING *";
const deactivateVendor =
  'UPDATE vendors SET "activationstatus" = FALSE WHERE vendorId = $1 RETURNING *';
const reactivateVendor =
  'UPDATE vendors SET "activationstatus" = TRUE WHERE vendorId = $1 RETURNING *';
const deleteVendor = "DELETE FROM vendors WHERE vendorId = $1 RETURNING *";

export default {
  getAllVendors,
  getVendorById,
  getVendorByUserId,
  createVendor,
  updateVendor,
  deactivateVendor,
  reactivateVendor,
  deleteVendor,
};
