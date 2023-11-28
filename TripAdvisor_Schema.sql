CREATE SEQUENCE user_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_user_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'user_' || nextval('user_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    userId TEXT Default generate_custom_user_id() PRIMARY KEY,
    fName VARCHAR(25) NOT NULL,
    lName VARCHAR(25) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(50) NOT NULL,
    stAdd VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    profilePicUrl TEXT DEFAULT NULL,
    activationStatus Boolean NOT NULL DEFAULT TRUE
);

-- ==================================

CREATE SEQUENCE vndr_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_vendor_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'vndr_' || nextval('vndr_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE vendors (
    vendorId TEXT DEFAULT generate_custom_vendor_id() PRIMARY KEY,
    userId TEXT REFERENCES users(userId) NOT NULL Unique,
    cnicNumber VARCHAR(15) NOT NULL Unique,
	activationStatus Boolean NOT NULL DEFAULT TRUE
);

-- ==================================

CREATE SEQUENCE htl_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_hotel_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'htl_' || nextval('htl_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE vendorHotelPosting (
    hotelId TEXT PRIMARY KEY DEFAULT generate_custom_hotel_id(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    pictures TEXT[] DEFAULT NULL, 
    vendorId TEXT REFERENCES vendors(vendorId) NOT NULL,
    city VARCHAR(50) NOT NULL,
    stAdd VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    openingTime TIME,
    closingTime TIME
);

-- ==================================

CREATE SEQUENCE room_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_room_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'room_' || nextval('room_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE HotelRooms (
    RoomId TEXT PRIMARY KEY DEFAULT generate_custom_room_id(),
    pricePerDay DECIMAL(10, 2) NOT NULL,
    noOfPerson INT NOT NULL,
    hotelId TEXT REFERENCES vendorHotelPosting(hotelId) NOT NULL,
    category VARCHAR(20) NOT NULL,
	resvStatus Boolean NOT NULL DEFAULT FALSE
);

-- ==================================

CREATE TABLE Payment (
    paymentId SERIAL PRIMARY KEY,
    paymentType VARCHAR(50) NOT NULL
);

INSERT INTO Payment (paymentType)
VALUES
('Credit Card'),
('PayPal'),
('Cash');

SELECT * FROM Payment

-- ==================================

CREATE SEQUENCE book_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_book_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'book_' || nextval('book_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE HotelRoomBooking (
    bookId TEXT PRIMARY KEY DEFAULT generate_custom_book_id(),
    userId TEXT REFERENCES users(UserId) NOT NULL,
    hotelRoomId TEXT REFERENCES HotelRooms(roomId) NOT NULL,
    paymentType INT REFERENCES Payment(paymentId) NOT NULL,
	BookingstartTime TIMESTAMP NOT NULL,
    bookingTimeEnd TIMESTAMP NOT NULL
);

-- ==================================

CREATE SEQUENCE rst_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_rst_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'rst_' || nextval('rst_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE VendorRestaurantPosting (
    restaurantId TEXT PRIMARY KEY DEFAULT generate_custom_rst_id(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    pictures TEXT[] DEFAULT NULL,
    vendorId TEXT REFERENCES Vendors(VendorId) NOT NULL, 
    city VARCHAR(50) NOT NULL,
    stAdd VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    openingTime TIME,
    closingTime TIME
);


-- ==================================

CREATE SEQUENCE dish_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_dish_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'dish_' || nextval('dish_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE DishTable (
    DishId TEXT PRIMARY KEY DEFAULT generate_custom_dish_id(),
    DishName VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    restaurantId TEXT REFERENCES VendorRestaurantPosting(RestaurantId) NOT NULL
);

-- ==================================

CREATE SEQUENCE resv_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_resv_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'resv_' || nextval('resv_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE RestaurantReservation (
    resvId TEXT PRIMARY KEY DEFAULT generate_custom_resv_id(),
    userId TEXT REFERENCES users(UserId) NOT NULL,
    RestaurantId TEXT REFERENCES VendorRestaurantPosting(RestaurantId) NOT NULL,
    paymentType INT REFERENCES Payment(paymentId) NOT NULL,
    bookingTimeStart TIMESTAMP NOT NULL,
    bookingTimeEnd TIMESTAMP NOT NULL
);

-- ========================

CREATE SEQUENCE htlRew_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_htlRew_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'htlRew_' || nextval('htlRew_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE ReviewsHotel (
    htlRewId TEXT PRIMARY KEY DEFAULT generate_custom_htlRew_id(),
    HotelId TEXT REFERENCES VendorHotelPosting(hotelId) NOT NULL,
    userId TEXT REFERENCES users(UserId) NOT NULL,
    reviews TEXT
);

-- ==================================

CREATE SEQUENCE rstRew_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_custom_rstRew_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    SELECT 'rstRew_' || nextval('rstRew_id_seq')::TEXT INTO new_id;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE ReviewsRestaurant (
    rstRewId TEXT PRIMARY KEY DEFAULT generate_custom_rstRew_id(),
    restaurantId TEXT REFERENCES VendorRestaurantPosting(RestaurantId) NOT NULL,
    userId TEXT REFERENCES users(UserId) NOT NULL,
    reviews TEXT
);
