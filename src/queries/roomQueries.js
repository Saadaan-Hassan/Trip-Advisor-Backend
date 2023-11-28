const getAllRooms = 'SELECT * FROM hotelRooms'
const getRoomById = 'SELECT * FROM hotelRooms WHERE roomId = $1'
const createRoom = 'INSERT INTO hotelRooms (pricePerDay, noOfPerson, hotelId, category) VALUES ($1, $2, $3, $4) RETURNING *'
const updateRoom = 'UPDATE hotelRooms SET  priceperday = $1, noofperson = $2, hotelId = $3, category = $4 WHERE roomId = $5 RETURNING *'
const deleteRoom = 'DELETE FROM hotelRooms WHERE roomId = $1 RETURNING *'

export default {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
}