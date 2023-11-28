import { Router } from "express";
import vendorController from "../../controllers/vendorController.js";
import { checkVendorAuth, checkUserAuth } from "../middleware/auth.js";

const router = Router();

// @desc: Get all vendors
// @route: GET /api/v1/tripadvisor/vendors/
// @access: Public
router.get("/", vendorController.getVendors);

// @desc: Get vendor by id
// @route: GET /api/v1/tripadvisor/vendors/:id
// @access: Public
router.get("/:id", vendorController.getVendorById);

// @desc: Create new vendor
// @route: POST /api/v1/tripadvisor/vendors/signup
// @access: Public
router.post("/signup", checkUserAuth, vendorController.signupVendor);

// @desc: Login vendor
// @route: POST /api/v1/tripadvisor/vendors/login
// @access: Private/Vendor
router.post("/login", checkUserAuth, vendorController.loginVendor);

// @desc: Update vendor
// @route: PUT /api/v1/tripadvisor/vendors/:id
// @access: Private/Vendor
router.put("/:id", checkVendorAuth, vendorController.updateVendor);

// @desc: Deactivate vendor
// @route: PUT /api/v1/tripadvisor/vendors/:id/deactivate
// @access: Private/Vendor
router.put("/:id/deactivate", checkVendorAuth, vendorController.deactivateVendor);

// @desc: Reactivate vendor
// @route: PUT /api/v1/tripadvisor/vendors/:id/reactivate
// @access: Private
router.put("/:id/reactivate", vendorController.reactivateVendor);

// @desc: Delete vendor
// @route: DELETE /api/v1/tripadvisor/vendors/:id
// @access: Private/Vendor
router.delete("/:id", checkVendorAuth, vendorController.deleteVendor);

export default router;
