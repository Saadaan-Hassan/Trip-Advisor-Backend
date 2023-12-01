import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import api from "./src/api/api.js";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./src/config/firebaseConfig.js";

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Express
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your actual client's origin
    credentials: true,
  })
);

app.use("/api/v1/tripadvisor", api);
app.get("/", (req, res) => {
  res.send("Welcome to Trip Advisor API");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
