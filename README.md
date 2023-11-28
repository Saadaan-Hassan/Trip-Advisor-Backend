# Trip Advisor Backend

Welcome to the Trip Advisor Backend repository! This backend is built using Express.js and PostgreSQL, serving as the server for the Trip Advisor API. It includes various endpoints for managing users, vendors, hotels, rooms, restaurant reservations, reviews, dishes, payments, and more.

Additionally, the backend stores images of user profiles, hotels, and restaurants on Firebase Storage.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Middleware](#middleware)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Project Structure

The project structure is organized into different directories, each serving a specific purpose:

- **src**: Contains the source code for the application.
  - **api**: Defines the main API routes.
  - **config**: Configuration files, such as Firebase configuration.
  - **controllers**: Controllers handling business logic.
  - **middleware**: Custom middleware for authentication.
  - **routes**: Route definitions for different entities.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Trip-Advisor-Backend.git
   ```

2. Install dependencies:

   ```bash
   cd trip-advisor-backend
   npm install
   ```

3. Set up environment variables:

   Create a .env file in the root directory by renaming .env.sample to .env. Add your credential information, such as database connection details and API keys, to this file.

4. Run the application:

   ```bash
   npm run dev
   ```

## Usage

The server will be running at http://localhost:{PORT}by default. You can explore the API endpoints using tools like Postman or integrate it with your frontend application.

## Endpoints

The API provides various endpoints for different entities. Here are some key endpoints:

- **`/api/v1/tripadvisor/users`** : User-related operations.
- **`/api/v1/tripadvisor/vendors`** : Vendor-related operations.
- **`/api/v1/tripadvisor/hotels`** : Hotel-related operations.
- **`/api/v1/tripadvisor/hotel-rooms`** : Hotel room-related operations.
- **`/api/v1/tripadvisor/restaurant-reservations`** : Restaurant reservation-related operations.
- **`/api/v1/tripadvisor/reviews`** : Review-related operations.
- **`/api/v1/tripadvisor/dishes`** : Dish-related operations.
- **`/api/v1/tripadvisor/payments`** : Payment-related operations.

For a detailed list of all endpoints, please refer to the [api.js](src/api/api.js) file.

## Middleware

The API uses custom middleware for authentication. The middleware is defined in the [auth.js](src/api/middleware/auth.js) file. It is used to protect certain routes from unauthorized access.s

## Technology Stack

The Trip Advisor Backend is built using the following technologies:

- **Express.js**: A web application framework for Node.js used for building robust and scalable APIs.
- **PostgreSQL**: A powerful, open-source relational database system.
- **Firebase Storage**: Cloud storage service used for storing images of user profiles, hotels, and restaurants.
- **Node.js**: A JavaScript runtime for executing server-side code.
- **Multer**: Middleware for handling multipart/form-data, used for image uploads.
- **bcrypt**: A library for hashing passwords.
- **JSON Web Token (jsonwebtoken)**: Used for authentication and creating secure tokens.
- **Nodemon**: A utility that monitors for changes and automatically restarts the server during development.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: Module for loading environment variables from a .env file.
- **pg**: PostgreSQL client for Node.js.

## Contributing

Contributions are welcome! Please refer to the [contributing guidelines](CONTRIBUTING.md) for detailed instructions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

- [Saadaan Hassan](https://github.com/Saadaan-Hassan)

Feel free to reach out if you have any questions or need further assistance!
