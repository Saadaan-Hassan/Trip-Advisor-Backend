const getAllHotelRoomBookings = "SELECT * FROM HotelRoomBooking";
const getHotelRoomBookingById =
  "SELECT * FROM HotelRoomBooking WHERE bookId = $1";
const getHotelRoomBookingByVendorId = `SELECT
  hrb.bookId,
  hrb.userId,
  hrb.hotelRoomId,
  hr.pricePerDay,
  hr.noOfPerson,
  vhp.title AS hotel_title,
  vhp.city AS hotel_city,
  vhp.stAdd AS hotel_address,
  vhp.country AS hotel_country,
  hrb.paymentType,
  p.paymentType AS payment_type,
  hrb.BookingstartTime,
  hrb.bookingTimeEnd
FROM
  HotelRoomBooking hrb
JOIN
  HotelRooms hr ON hrb.hotelRoomId = hr.RoomId
JOIN
  vendorHotelPosting vhp ON hr.hotelId = vhp.hotelId
JOIN
  Payment p ON hrb.paymentType = p.paymentId
WHERE
  vhp.vendorId = $1
LIMIT 100;
`;
const getHotelRoomBookingByUserId =
  "SELECT * FROM HotelRoomBooking WHERE userId = $1";
const getSpecificHotelRoomBookingForVendor =
  "SELECT * FROM HotelRooms WHERE RoomId = (SELECT hotelRoomId FROM HotelRoomBooking WHERE bookId = $1 AND hotelId = (SELECT hotelId FROM vendorHotelPosting WHERE vendorId = $2))";
const createHotelRoomBooking =
  "INSERT INTO HotelRoomBooking (hotelRoomId, userId, paymentType, BookingstartTime, bookingTimeEnd) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const updateHotelRoomBooking =
  "UPDATE HotelRoomBooking SET hotelRoomId = $1, userId = $2, paymentType = $3, BookingstartTime = $4, bookingTimeEnd = $5 WHERE bookId = $6 RETURNING *";
const deleteHotelRoomBooking =
  "DELETE FROM HotelRoomBooking WHERE bookId = $1 RETURNING *";
const updateResvStatus =
  "UPDATE hotelRooms SET resvStatus = $1 WHERE roomId = $2 RETURNING *";
const getResvStatus = "SELECT resvStatus FROM hotelRooms WHERE roomId = $1";

export default {
  getAllHotelRoomBookings,
  getHotelRoomBookingById,
  createHotelRoomBooking,
  updateHotelRoomBooking,
  deleteHotelRoomBooking,
  getHotelRoomBookingByUserId,
  getHotelRoomBookingByVendorId,
  getSpecificHotelRoomBookingForVendor,
  updateResvStatus,
  getResvStatus,
};
