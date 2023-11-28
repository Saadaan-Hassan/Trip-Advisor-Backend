import pool from "../config/dbConfig.js";
import userQueries from "../queries/userQueries.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

dotenv.config();

// @desc: Get all users
// @route: GET /api/v1/tripadvisor/users/
// @access: Public
const getUsers = async (req, res) => {
  try {
    const users = await pool.query(userQueries.getUsers);
    res.status(200).json({
      count: users.rows.length,
      users: users.rows.map((user) => sanitizeUser(user)),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Get user by id
// @route: GET /api/v1/tripadvisor/users/:id
// @access: Public
const getUserById = (req, res) => {
  try {
    const id = req.params.id;
    pool.query(userQueries.getUserById, [id], (error, results) => {
      if (error) res.status(400).json({ error: error.message });

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // return the user but not the password
      const user = results.rows[0];
      delete user.password;

      res.status(200).json({ user });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Create new user
// @route: POST /api/v1/tripadvisor/users/signup
// @access: Public
const signupUser = async (req, res) => {
  try {
    const { fName, lName, password, email, phone, city, stAdd, country } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(userQueries.createUser, [
      fName,
      lName,
      hashedPassword,
      email,
      phone,
      city,
      stAdd,
      country,
    ]);

    if (newUser.rowCount === 0) {
      return res.status(400).json({ message: "User not created" });
    }

    if (newUser.rowCount === 1) {
      const token = jwt.sign(
        {
          email: newUser.rows[0].email,
          userId: newUser.rows[0].userid,
        },
        process.env.JWT_USER_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(201).json({
        message: "User created successfully",
        user: sanitizeUser(newUser.rows[0]),
        token: token,
      });
    }
  } catch (error) {
    if (error.code === "23505")
      return res.status(409).json({ error: error.detail });

    if (error.code === "23502")
      return res.status(400).json({ error: error.detail });

    return res.status(500).json({ error: error.message });
  }
};

// @desc: Login user
// @route: POST /api/v1/tripadvisor/users/login
// @access: Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(userQueries.getUserByEmail, [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const hashedPassword = user.rows[0].password;

    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
      const token = jwt.sign(
        {
          email: user.rows[0].email,
          userId: user.rows[0].userid,
        },
        process.env.JWT_USER_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Authentication successful",
        token: token,
      });
    }

    return res.status(401).json({ message: "Authentication failed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc: Update User
// @route: PUT /api/v1/tripadvisor/users/:id
// @access: Private/User
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { fName, lName, password, email, phone, city, stAdd, country } =
      req.body;

    const user = await pool.query(userQueries.getUserById, [id]);

    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const oldData = user.rows[0];

    const newFName = fName || oldData.fname;
    const newLName = lName || oldData.lname;
    const newPassword = password || oldData.password;
    const newEmail = email || oldData.email;
    const newPhone = phone || oldData.phone;
    const newCity = city || oldData.city;
    const newStAdd = stAdd || oldData.stadd;
    const newCountry = country || oldData.country;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await pool.query(userQueries.updateUser, [
      newFName,
      newLName,
      hashedPassword,
      newEmail,
      newPhone,
      newCity,
      newStAdd,
      newCountry,
      id,
    ]);

    if (updatedUser.rowCount === 0) {
      return res.status(400).json({ message: "User not updated" });
    }

    if (updatedUser.rowCount === 1) {
      return res.status(200).json({
        message: "User updated successfully",
        user: sanitizeUser(updatedUser.rows[0]),
      });
    }
  } catch (error) {
    if (error.code === "23505")
      return res.status(409).json({ error: error.detail });

    if (error.code === "23502")
      return res.status(400).json({ error: error.detail });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Add/Update user profile picture
// @route: PUT /api/v1/tripadvisor/users/profilePic/:id
// @access: Private/User
const updateProfilePic = async (req, res) => {
  try {
    // Check for Multer validation errors
    if (!req.file) {
      if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
      }
      return res
        .status(400)
        .json({ error: "Please select an image to upload" });
    }

    // Check if the file's size is greater than 2MB
    if (req.file.size > 2 * 1024 * 1024)
      return res.status(400).json({ error: "File size cannot exceed 2MB" });

    // Check if the user exists
    const id = req.params.id;
    const user = await pool.query(userQueries.getUserById, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a profile picture URL
    const existingProfilePicURL = user.rows[0].profilepicurl;

    // If an existing profile picture URL exists, delete the existing file
    if (existingProfilePicURL) {
      const existingFileName = existingProfilePicURL
        .split("%2F")
        .pop()
        .split("?")[0];
      const existingFileRef = ref(
        getStorage(),
        `profileImages/${user.rows[0].userid}/${existingFileName}`
      );

      // Delete the existing file
      await deleteObject(existingFileRef);
    }

    // Upload the new file
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `profileImages/${user.rows[0].userid}/${req.file.originalname}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    // Grab the public URL for the new file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update the user profile picture URL in the database
    await pool.query(userQueries.updateProfilePic, [downloadURL, id]);

    // Send the response to the client
    return res.send({
      message: "File uploaded to Firebase storage",
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Deactivate user by id
// @route: POST /api/v1/tripadvisor/users/:id/deactivate
// @access: Private/User
const deactivateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await pool.query(userQueries.getUserById, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const deactivatedUser = await pool.query(userQueries.deactivateUser, [id]);

    if (deactivatedUser.rowCount === 0) {
      return res.status(400).json({
        message: "User not deactivated",
        error: error.message,
        user: deactivatedUser.rows[0],
      });
    }

    if (deactivatedUser.rowCount === 1) {
      return res.status(200).json({
        message: "User deactivated successfully",
        user: sanitizeUser(deactivatedUser.rows[0]),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: ReActivate user by id
// @route: POST /api/v1/tripadvisor/users/:id/reactivate
// @access: Private
const reactivateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await pool.query(userQueries.getUserById, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const reactivatedUser = await pool.query(userQueries.reactivateUser, [id]);

    if (reactivatedUser.rowCount === 0) {
      return res.status(400).json({ message: "User not reactivated" });
    }

    if (reactivatedUser.rowCount === 1) {
      return res.status(200).json({
        message: "User reactivated successfully",
        user: sanitizeUser(reactivatedUser.rows[0]),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Delete user by id
// @route: DELETE /api/v1/tripadvisor/users/:id
// @access: Private/User
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await pool.query(userQueries.getUserById, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await pool.query(userQueries.deleteUser, [id]);

    if (deletedUser.rowCount === 0) {
      return res.status(400).json({ message: "User not deleted" });
    }

    // Delete the user profile picture from Firebase storage
    const existingProfilePicURL = user.rows[0].profilepicurl;

    if (existingProfilePicURL) {
      const existingFileName = existingProfilePicURL
        .split("%2F")
        .pop()
        .split("?")[0];
      const existingFileRef = ref(
        getStorage(),
        `profileImages/${user.rows[0].userid}/${existingFileName}`
      );

      // Delete the existing file
      await deleteObject(existingFileRef);
    }

    if (deletedUser.rowCount === 1) {
      return res.status(200).json({
        message: "User deleted successfully",
        user: sanitizeUser(deletedUser.rows[0]),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc: Sanitize user object
function sanitizeUser(user) {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export default {
  getUsers,
  getUserById,
  signupUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  loginUser,
  updateProfilePic,
  deleteUser,
};
