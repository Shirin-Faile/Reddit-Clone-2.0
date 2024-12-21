"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const comment_1 = __importDefault(require("./routes/comment"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Allow cross-origin requests
app.use(express_1.default.json()); // Parse incoming JSON requests
// API Routes
console.log("Loading API routes...");
app.use("/api/auth", auth_1.default);
app.use("/api/posts", post_1.default);
app.use("/api/comments", comment_1.default);
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
