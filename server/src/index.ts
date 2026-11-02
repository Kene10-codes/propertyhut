import express, { Request, Response } from "express";
// @ts-ignore cors lacks installed TypeScript declarations.
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";

// Import the authRoutes module
import authRoutes from "./route/authRoutes.js";

// Initialize dotenv configuration
dotenv.config();

// Create an instance of the Express application
const app = express();
// Define the port for the server to listen on
const PORT = env.PORT || 3000;
// Enable CORS and JSON parsing middleware
app.use(cors([{ origin: "http://localhost:5173", credentials: true }]));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API MIDDLEWARE ROUTES
app.use("/api/auth", authRoutes);

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Property Hut is running now...",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome, to Property Hut server...");
});

// Register the error handler
app.use(errorHandler);

// Call the database function
try {
  await connectDB();
  app.listen(env.PORT, () => console.log(`API listening on ${env.PORT}`));
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
    process.exit(1);
  }
}
