import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

// Initialize dotenv configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
