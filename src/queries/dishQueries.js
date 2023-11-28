const getAllDishes = "SELECT * FROM DishTable";
const getDishById = "SELECT * FROM DishTable WHERE dishId = $1";
const createDish =
  "INSERT INTO DishTable (dishName, price, restaurantId) VALUES ($1, $2, $3) RETURNING *";
const updateDish =
  "UPDATE DishTable SET dishName = $1, price = $2 WHERE dishId = $3 RETURNING *";
const deleteDish = "DELETE FROM DishTable WHERE dishId = $1 RETURNING *";
const getDishesByRestaurantId =
  "SELECT * FROM DishTable WHERE restaurantId = $1";

export default {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getDishesByRestaurantId,
};
