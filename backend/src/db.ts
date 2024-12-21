import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MongoDB URI is missing in the environment variables.");
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred while connecting to MongoDB.");
    }
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
