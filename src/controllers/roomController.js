import pool from "../config/dbConfig.js";
import hotelRoomsQueries from "../queries/roomQueries.js";

// @desc: Get all rooms
// @route: GET /api/v1/tripadvisor/hotelrooms
// @access: Public
const getAllRooms = async (req, res) => {
  try {
    const result = await pool.query(hotelRoomsQueries.getAllRooms);
    res.status(200).json({ count: result.rowCount, hotelRooms: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc: Get room by id
// @route: GET /api/v1/tripadvisor/hotelrooms/:id
// @access: Public
const getRoomById = async (req, res) => {
  try {
    const result = await pool.query(hotelRoomsQueries.getRoomById, [
      req.params.id,
    ]);
    res.status(200).json({ count: result.rowCount, hotelRooms: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc: Create new room
// @route: POST /api/v1/tripadvisor/hotelrooms
// @access: Private/Vendor
const createRoom = async (req, res) => {
  try {
    const { pricePerDay, noOfPerson, hotelId, category } = req.body;
    const result = await pool.query(hotelRoomsQueries.createRoom, [
      pricePerDay,
      noOfPerson,
      hotelId,
      category,
    ]);
    res.status(201).json({ hotelRoom: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc: Update room
// @route: PUT /api/v1/tripadvisor/hotelrooms/:id
// @access: Private/Vendor
const updateRoom = async (req, res) => {
  try {
    const id = req.params.id;

    const results = await pool.query(hotelRoomsQueries.getRoomById, [id]);

    if (results.rows.length === 0) {
      return res.status(404).send("Room not found");
    }

    const oldRoom = results.rows[0];

    const updatedRoom = {
      pricePerDay: req.body.pricePerDay || oldRoom.priceperday,
      noOfPerson: req.body.noOfPerson || oldRoom.noofperson,
      hotelId: req.body.hotelId || oldRoom.hotelid,
      category: req.body.category || oldRoom.category,
    };

    const result = await pool.query(hotelRoomsQueries.updateRoom, [
      updatedRoom.pricePerDay,
      updatedRoom.noOfPerson,
      updatedRoom.hotelId,
      updatedRoom.category,
      id,
    ]);

    res.status(200).json({
      message: "Room updated successfully",
      updatedRoom: result.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// @desc: Delete room
// @route: DELETE /api/v1/tripadvisor/hotelrooms/:id
// @access: Private/Vendor
const deleteRoom = (req, res) => {
  const id = req.params.id;

  pool.query(hotelRoomsQueries.deleteRoom, [id], (error, results) => {
    if (error) {
      res.status(400).json({ error });
    }

    if (results.rows.length === 0) {
      res.status(404).send("Room not found");
    }

    res.status(200).json({
      message: "Room deleted successfully",
      deletedRoom: results.rows[0],
    });
  });
};

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
