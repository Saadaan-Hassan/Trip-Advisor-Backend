import { Router } from "express";
import userController from "../../controllers/userController.js";
import { checkUserAuth } from "../middleware/auth.js";
import multer from "multer";

const router = Router();

// @desc: Get all users
// @route: GET /api/v1/tripadvisor/users/
// @access: Public
router.get("/", userController.getUsers);

// @desc: Get user by id
// @route: GET /api/v1/tripadvisor/users/:id
// @access: Public
router.get("/:id", userController.getUserById);

// @desc: Create new user
// @route: POST /api/v1/tripadvisor/users/signup
// @access: Public
router.post("/signup", userController.signupUser);

// @desc: Login user
// @route: POST /api/v1/tripadvisor/users/login
// @access: Public
router.post("/login", userController.loginUser);

// @desc: Update user
// @route: PUT /api/v1/tripadvisor/users/:id
// @access: Private/User
router.put("/:id", checkUserAuth, userController.updateUser);

// @desc: Add/Update user profile picture
// @route: PUT /api/v1/tripadvisor/users/profilePic/:id
// @access: Private/User
const upload = multer({
  storage: multer.memoryStorage(),
});

router.put(
  "/profilePic/:id",
  checkUserAuth,
  upload.single("profilePic"),
  userController.updateProfilePic
);

// @desc: Deactivate user
// @route: DELETE /api/v1/tripadvisor/users/:id/deactivate
// @access: Private/User
router.post("/:id/deactivate", checkUserAuth, userController.deactivateUser);

// @desc: ReActivate user
// @route: POST /api/v1/tripadvisor/users/:id/reactivate
// @access: Private
router.post("/:id/reactivate", checkUserAuth, userController.reactivateUser);

// @desc: Delete user
// @route: DELETE /api/v1/tripadvisor/users/:id
// @access: Private/User
router.delete("/:id", checkUserAuth, userController.deleteUser);

export default router;
