const getAllHotelReviews = "SELECT * FROM ReviewsHotel";
const getHotelReviewById = "SELECT reviews FROM ReviewsHotel WHERE htlRewId = $1";
const getHotelReviewsByHotelId = "SELECT * FROM ReviewsHotel WHERE hotelId = $1";
const createHotelReview = "INSERT INTO ReviewsHotel (hotelId, userId, reviews) VALUES ($1, $2, $3) RETURNING *";
const updateHotelReview = "UPDATE ReviewsHotel SET reviews = $1 WHERE htlRewId = $2 RETURNING *";
const deleteHotelReview = "DELETE FROM ReviewsHotel WHERE htlRewId = $1 Returning *";

export default {
    getAllHotelReviews,
    getHotelReviewById,
    getHotelReviewsByHotelId,
    createHotelReview,
    updateHotelReview,
    deleteHotelReview,
    };