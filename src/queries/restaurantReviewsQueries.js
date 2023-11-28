const getAllRestaurantReviews = "SELECT * FROM ReviewsRestaurant";
const getRestaurantReviewById =
  "SELECT reviews FROM ReviewsRestaurant WHERE rstRewId = $1";
const getRestaurantReviewsByRestaurantId =
  "SELECT * FROM ReviewsRestaurant WHERE restaurantId = $1";
const createRestaurantReview =
  "INSERT INTO ReviewsRestaurant (restaurantId, userId, reviews) VALUES ($1, $2, $3) RETURNING *";
const updateRestaurantReview =
  "UPDATE ReviewsRestaurant SET reviews = $1 WHERE rstRewId = $2 RETURNING *";
const deleteRestaurantReview =
  "DELETE FROM ReviewsRestaurant WHERE rstRewId = $1 Returning *";

export default {
  getAllRestaurantReviews,
  getRestaurantReviewById,
  getRestaurantReviewsByRestaurantId,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
};
