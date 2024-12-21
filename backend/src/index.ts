import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// API Routes
console.log("Loading API routes...");
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Reddit Clone API!",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      comments: "/api/comments",
    },
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
