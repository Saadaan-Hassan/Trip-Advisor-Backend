import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// This is the connection to the local database

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

// This is the connection to the Neon Postgres database
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    require: true,
  },
});

export default pool;
