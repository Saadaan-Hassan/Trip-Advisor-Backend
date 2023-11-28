const getUsers = "SELECT * FROM users ORDER BY userId ASC";
const getUserById = "SELECT * FROM users WHERE userId = $1";
const createUser =
  "INSERT INTO users (fName, lName, password, email, phone, city, stAdd, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
const updateUser =
  "UPDATE users SET fName = $1, lName = $2, password = $3, email = $4, phone = $5, city = $6, stAdd = $7, country = $8 WHERE userId = $9 RETURNING *";
const deactivateUser =
  'UPDATE users SET "activationStatus" = FALSE WHERE userId = $1 RETURNING *';
const reactivateUser =
  'UPDATE users SET "activationStatus" = TRUE WHERE userId = $1 RETURNING *';
const getUserByEmail = "SELECT * FROM users WHERE email = $1 LIMIT 1";
const updateProfilePic = "UPDATE users SET profilePicUrl = $1 WHERE userId = $2 RETURNING *";
const deleteUser = "DELETE FROM users WHERE userId = $1 RETURNING *";

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  getUserByEmail,
  updateProfilePic,
  deleteUser,
};
