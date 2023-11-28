const getAllHotels = "SELECT * FROM vendorHotelPosting";
const getHotelById = "SELECT * FROM vendorHotelPosting WHERE hotelId = $1";
const createHotel =
  "INSERT INTO vendorHotelPosting (title, description, vendorId, city, stAdd, country, openingTime, closingTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
const updateHotel =
  "UPDATE vendorHotelPosting SET title = $1, description = $2, city = $3, stAdd = $4, country = $5, openingTime = $6, closingTime = $7 WHERE hotelId = $8 RETURNING *";
const deleteHotel =
  "DELETE FROM vendorHotelPosting WHERE hotelId = $1 RETURNING *";
const updateHotelPictures =
  "UPDATE vendorHotelPosting SET pictures = $1 WHERE hotelId = $2 RETURNING *";

export default {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  updateHotelPictures,
  deleteHotel,
};
