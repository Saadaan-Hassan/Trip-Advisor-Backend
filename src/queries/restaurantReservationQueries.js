const getAllRestaurantReservations = "SELECT * FROM RestaurantReservation";
const getRestaurantReservationById =
  "SELECT * FROM RestaurantReservation WHERE resvId = $1";
const getRestaurantReservationByUserId =
  "SELECT * FROM RestaurantReservation WHERE userId = $1";
const getRestaurantReservationByRestaurantId =
  "SELECT * FROM RestaurantReservation WHERE restaurantId = $1";
const getRestaurantReservationByVendorID =
  "SELECT * FROM RestaurantReservation WHERE restaurantId = (SELECT restaurantId FROM vendorRestaurantPosting WHERE vendorId = $1)";
const createRestaurantReservation =
  "INSERT INTO RestaurantReservation (restaurantId, userId, paymentType, bookingTimeStart, bookingTimeEnd) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const updateRestaurantReservation =
  "UPDATE RestaurantReservation SET restaurantId = $1, userId = $2, paymentType = $3, bookingTimeStart = $4, bookingTimeEnd = $5 WHERE resvId = $6 RETURNING *";
const deleteRestaurantReservation =
  "DELETE FROM RestaurantReservation WHERE resvId = $1 RETURNING *";

export default {
  getAllRestaurantReservations,
  getRestaurantReservationById,
  getRestaurantReservationByUserId,
  getRestaurantReservationByRestaurantId,
  getRestaurantReservationByVendorID,
  createRestaurantReservation,
  updateRestaurantReservation,
  deleteRestaurantReservation,
};
