// Vercel serverless function wrapper for Express app
import app from "../app.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB (Vercel will reuse connections across invocations)
let isConnected = false;
let connectionPromise = null;

const connectMongo = async () => {
  if (isConnected) {
    return;
  }
  
  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }
  
  connectionPromise = (async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      isConnected = true;
      console.log("MongoDB connected (serverless)");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      isConnected = false;
      connectionPromise = null;
      throw error;
    }
  })();
  
  return connectionPromise;
};

// Export the Express app as a serverless function
// Vercel automatically handles Express apps when exported this way
export default async function handler(req, res) {
  // Ensure MongoDB is connected before handling request
  try {
    await connectMongo();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return res.status(500).json({ message: "Database connection failed" });
  }
  
  // Pass request to Express app
  return app(req, res);
}
