const getAllRestaurants =
  "SELECT * FROM VendorRestaurantPosting ORDER BY RestaurantId ASC";
const getRestaurantById =
  "SELECT * FROM VendorRestaurantPosting WHERE RestaurantId = $1";
const createRestaurant =
  "INSERT INTO VendorRestaurantPosting (title, description, pictures, vendorId, city, stAdd, country, openingTime, closingTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
const updateRestaurant =
  "UPDATE VendorRestaurantPosting SET title = $1, description = $2, city = $3, stAdd = $4, country = $5, openingTime = $6, closingTime = $7 WHERE RestaurantId = $8 RETURNING *";
const deleteRestaurant =
  "DELETE FROM VendorRestaurantPosting WHERE restaurantId = $1 RETURNING *";
const updateRestaurantPictures =
  "UPDATE VendorRestaurantPosting SET pictures = $1 WHERE restaurantId = $2 RETURNING *";

export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  updateRestaurantPictures,
  deleteRestaurant,
};
