import pool from "../config/dbConfig.js";
import hotelQueries from "../queries/hotelQueries.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// @desc Get all hotels
// @route GET /api/v1/tripadvisor/hotels
// @access Public
const getHotels = async (req, res) => {
  try {
    const result = await pool.query(hotelQueries.getAllHotels);
    res.status(200).json({ count: result.rowCount, hotels: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Get a hotel
// @route GET /api/v1/tripadvisor/hotels/:id
// @access Public
const getHotel = async (req, res) => {
  try {
    const result = await pool.query(hotelQueries.getHotelById, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ hotel: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Create a hotel
// @route POST /api/v1/tripadvisor/hotels
// @access Private/Vendor
const createHotel = async (req, res) => {
  try {
    const result = await pool.query(hotelQueries.createHotel, [
      req.body.title,
      req.body.description,
      req.body.vendorId,
      req.body.city,
      req.body.stAdd,
      req.body.country,
      req.body.openingTime,
      req.body.closingTime,
    ]);
    res.status(201).json({ message: "Hotel created", hotel: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Update a hotel
// @route PUT /api/v1/tripadvisor/hotels/:id
// @access Private/Vendor
const updateHotel = async (req, res) => {
  try {
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

    const hotel = await pool.query(hotelQueries.getHotelById, [id]);

    if (hotel.rows.length === 0) {
      return res.status(404).send("Hotel not found");
    }

    const oldData = hotel.rows[0];

    const newTitle = title || oldData.title;
    const newDescription = description || oldData.description;
    const newCity = city || oldData.city;
    const newStAdd = stAdd || oldData.stadd;
    const newCountry = country || oldData.country;
    const newOpeningTime = openingTime || oldData.openingtime;
    const newClosingTime = closingTime || oldData.closingtime;

    const result = await pool.query(hotelQueries.updateHotel, [
      newTitle,
      newDescription,
      newCity,
      newStAdd,
      newCountry,
      newOpeningTime,
      newClosingTime,
      id,
    ]);

    res.status(200).json({
      message: "Hotel updated Successfully",
      updateHotel: result.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc Add/Update hotel pictures
// @route PUT /api/v1/tripadvisor/hotels/pictures/:id
// @access Private/Vendor
const updateHotelPictures = async (req, res) => {
  try {
    const id = req.params.id;
    const pictures = req.files;

    // Check if pictures are provided
    if (!pictures || pictures.length === 0) {
      return res.status(400).json({ message: "No pictures provided" });
    }

    // Check if pictures are more than 5
    if (pictures.length > 5) {
      return res
        .status(400)
        .json({ message: "Cannot upload more than 5 pictures" });
    }

    // Check if pictures are more than 2MB
    if (pictures.some((picture) => picture.size > 2 * 1024 * 1024)) {
      return res
        .status(400)
        .json({ message: "Cannot upload pictures larger than 2MB" });
    }

    // Check if hotel exists
    const hotelResult = await pool.query(hotelQueries.getHotelById, [id]);

    if (hotelResult.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const hotel = hotelResult.rows[0];
    const oldPictures = hotel.pictures || [];

    // Check if adding new pictures exceeds the maximum limit of 5
    if (oldPictures.length + pictures.length > 5) {
      return res
        .status(400)
        .json({ message: "Will exceed maximum limit of 5 pictures" });
    }

    // Upload pictures to Firebase Storage
    const storage = getStorage();
    const urls = [];

    for (const picture of pictures) {
      const storageRef = ref(
        storage,
        `hotels/${id}/${Date.now()}_${picture.originalname}`
      );
      const uploadTask = uploadBytesResumable(storageRef, picture.buffer);

      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      urls.push(downloadURL);
    }

    // Combine old and new pictures
    const newPictures = [...oldPictures, ...urls];

    // Update hotel pictures in the database
    pool.query(
      hotelQueries.updateHotelPictures,
      [newPictures, id],
      (error, results) => {
        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({
          message: "Hotel pictures updated successfully",
          hotelId: id,
          pictures: results.rows[0].pictures,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ "Something went wrong": error.message });
  }
};

// @desc Delete hotel pictures
// @route DELETE /api/v1/tripadvisor/hotels/pictures/:id
// @access Private/Vendor
const deleteHotelPictures = async (req, res) => {
  try {
    const id = req.params.id;
    const pictures = req.body.pictures;

    if (!pictures) {
      return res.status(400).json({ message: "No pictures provided" });
    }

    // Chek if hotel exists
    const hotel = await pool.query(hotelQueries.getHotelById, [id]);

    if (hotel.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete pictures from Firebase Storage
    const storage = getStorage();

    for (const picture of pictures) {
      const pictureName = picture.split("%2F").pop().split("?")[0];
      const storageRef = ref(storage, `hotels/${id}/${pictureName}`);
      await deleteObject(storageRef);
    }

    // Update hotel pictures
    const oldPictures = hotel.rows[0].pictures;
    const newPictures = oldPictures.filter(
      (picture) => !pictures.includes(picture)
    );

    const result = await pool.query(hotelQueries.updateHotelPictures, [
      newPictures,
      id,
    ]);

    res.status(200).json({
      message: "Hotel pictures deleted successfully",
      hotelId: id,
      pictures: result.rows[0].pictures,
    });
  } catch (err) {
    if (err.code === "storage/object-not-found") {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(500).json({ "Something went wrong": err.message });
  }
};

// @desc Delete a hotel
// @route DELETE /api/v1/tripadvisor/hotels/:id
// @access Private/Vendor
const deleteHotel = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await pool.query(hotelQueries.getHotelById, [id]);

    if (hotel.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete hotel pictures from Firebase Storage
    const storage = getStorage();
    const pictures = hotel.rows[0].pictures;

    for (const picture of pictures) {
      const pictureName = picture.split("%2F").pop().split("?")[0];
      const storageRef = ref(storage, `hotels/${id}/${pictureName}`);
      await deleteObject(storageRef);
    }

    const result = await pool.query(hotelQueries.deleteHotel, [id]);

    res.status(200).json({
      message: "Hotel deleted successfully",
      deletedHotel: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ "Something went wrong": error.message });
  }
};

export {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  updateHotelPictures,
  deleteHotelPictures,
  deleteHotel,
};
