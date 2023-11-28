import pool from "../config/dbConfig.js";
import dishQueries from "../queries/dishQueries.js";

// @desc Get all dishes
// @route GET /api/v1/tripadvisor/dishes
// @access Public
const getAllDishes = async (req, res) => {
  try {
    const result = await pool.query(dishQueries.getAllDishes);
    res.status(200).json({ count: result.rowCount, dishes: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Get dish by id
// @route GET /api/v1/tripadvisor/dishes/:id
// @access Public
const getDishById = async (req, res) => {
  try {
    const result = await pool.query(dishQueries.getDishById, [req.params.id]);
    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Get dishes by restaurant id
// @route GET /api/v1/tripadvisor/dishes/restaurants/:id
// @access Public
const getDishesByRestaurantId = async (req, res) => {
  try {
    const result = await pool.query(dishQueries.getDishesByRestaurantId, [
      req.params.id,
    ]);
    if (result.rowCount > 0) {
      res.status(200).json({ count: result.rowCount, dishes: result.rows });
    } else {
      res.status(404).json({ message: "Dishes not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Create dish
// @route POST /api/v1/tripadvisor/dishes
// @access Private/Vendor
const createDish = async (req, res) => {
  try {
    const result = await pool.query(dishQueries.createDish, [
      req.body.dishName,
      req.body.dishPrice,
      req.body.resturantId,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Update dish
// @route PUT /api/v1/tripadvisor/dishes/:id
// @access Private/Vendor
const updateDish = (req, res) => {
  const id = req.params.id;

  const { dishName, dishPrice } = req.body;

  pool.query(dishQueries.getDishById, [id], (error, result) => {
    if (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: "Dish not found" });
    } else {
      const oldData = result.rows[0];

      const newDishName = dishName || oldData.dishname;
      const newDishPrice = dishPrice || oldData.dishprice;

      pool.query(
        dishQueries.updateDish,
        [newDishName, newDishPrice, id],
        (error, result) => {
          if (error) {
            res
              .status(500)
              .json({ message: "Something went wrong", error: error.message });
          } else {
            res.status(200).json(result.rows[0]);
          }
        }
      );
    }
  });
};

// @desc Delete dish
// @route DELETE /api/v1/tripadvisor/dishes/:id
// @access Private/Vendor
const deleteDish = (req, res) => {
  const id = req.params.id;

  pool.query(dishQueries.getDishById, [id], (error, result) => {
    if (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: "Dish not found" });
    } else {
      pool.query(dishQueries.deleteDish, [id], (error, result) => {
        if (error) {
          res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
        } else {
          res.status(200).json(result.rows[0]);
        }
      });
    }
  });
};

export {
  getAllDishes,
  getDishById,
  getDishesByRestaurantId,
  createDish,
  updateDish,
  deleteDish,
};
