import pool from "../config/dbConfig.js";
import restaurantQueries from "../queries/restaurantQueries.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// @desc Get all restaurants
// @route GET /api/v1/tripadvisor/restaurants
// @access Public
const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query(restaurantQueries.getAllRestaurants);
    res.status(200).json({ count: result.rowCount, restaurants: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

// @desc Get a Restaurant
// @route GET /api/v1/tripadvisor/restaurants/:id
// @access Private
const getRestaurant = async (req, res) => {
  try {
    const result = await pool.query(restaurantQueries.getRestaurantById, [
      req.params.id,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

// @desc Create a Restaurant
// @route POST /api/v1/tripadvisor/restaurants
// @access Private/Vendor
const createRestaurant = async (req, res) => {
  try {
    console.log(req.body);
    const result = await pool.query(restaurantQueries.createRestaurant, [
      req.body.title,
      req.body.description,
      [],
      req.body.vendorId,
      req.body.city,
      req.body.stAdd,
      req.body.country,
      req.body.openingTime,
      req.body.closingTime,
    ]);
    res
      .status(201)
      .json({ message: "Restaurant created", restaurant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

// @desc Update a Restaurant
// @route PUT /api/v1/tripadvisor/restaurants/:id
// @access Private/Vendor
const updateRestaurant = (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    city,
    stAdd,
    country,
    openingTime,
    closingTime,
  } = req.body;

  pool.query(restaurantQueries.getRestaurantById, [id], (error, results) => {
    if (error)
      return res.status(400).json({
        error,
        message: "Something went wrong when calling getRestaurantById",
      });

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const oldData = results.rows[0];

    const newTitle = title || oldData.title;
    const newDescription = description || oldData.description;
    const newCity = city || oldData.city;
    const newStAdd = stAdd || oldData.stadd;
    const newCountry = country || oldData.country;
    const newOpeningTime = openingTime || oldData.openingtime;
    const newClosingTime = closingTime || oldData.closingtime;

    pool.query(
      restaurantQueries.updateRestaurant,
      [
        newTitle,
        newDescription,
        newCity,
        newStAdd,
        newCountry,
        newOpeningTime,
        newClosingTime,
        id,
      ],
      (error, results) => {
        if (error)
          return res.status(400).json({
            error,
            message: "Something went wrong when calling updateRestaurant",
          });

        return res.status(200).json({ updatedRestaurant: results.rows[0] });
      }
    );
  });
};

// @desc Add/Update Restaurant pictures
// @route PUT /api/v1/tripadvisor/restaurants/pictures/:id
// @access Private/Vendor
const updateRestaurantPictures = async (req, res) => {
  try {
    const id = req.params.id;
    const pictures = req.files;

    if (!pictures) {
      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Chek if Restaurant exists
    const Restaurant = await pool.query(restaurantQueries.getRestaurantById, [
      id,
    ]);

    if (Restaurant.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Upload pictures to Firebase Storage
    const storage = getStorage();
    const urls = [];

    for (const picture of pictures) {
      const storageRef = ref(
        storage,
        `restaurants/${id}/${Date.now()}_${picture.originalname}`
      );
      const uploadTask = uploadBytesResumable(storageRef, picture.buffer);

      const snapshot = await uploadTask;

      const downloadURL = await getDownloadURL(snapshot.ref);

      urls.push(downloadURL);
    }

    // Update Restaurant pictures
    const oldPictures = Restaurant.rows[0].pictures;
    const newPictures = [...oldPictures, ...urls];

    pool.query(
      restaurantQueries.updateRestaurantPictures,
      [newPictures, id],
      (error, results) => {
        if (error) return res.status(400).json({ message: error });

        res.status(200).json({
          message: "Restaurant pictures updated successfully",
          updatedRestaurant: results.rows[0],
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Delete a Restaurant
// @route DELETE /api/v1/tripadvisor/restaurants/:id
// @access Private/Vendor
const deleteRestaurant = (req, res) => {
  const id = req.params.id;

  pool.query(restaurantQueries.getRestaurantById, [id], (error, results) => {
    if (error) res.status(400).json({ message: error });

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    pool.query(restaurantQueries.deleteRestaurant, [id], (error, results) => {
      if (error && error.code === "23503")
        return res.status(400).json({
          message:
            "Cannot delete a restaurant that has active reservations, dishes or reviews",
        });

      if (error) res.status(400).json({ message: error });

      res.status(200).json({
        message: "Restaurant deleted successfully",
        deletedRestaurant: results.rows,
      });
    });
  });
};

export {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  updateRestaurantPictures,
  deleteRestaurant,
};
