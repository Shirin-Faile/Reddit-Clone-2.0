"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("../models/post"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Create a new post
router.post('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. No user found.' });
        }
        const newPost = new post_1.default({
            title,
            content,
            user: req.user.id, // Now guaranteed to exist
        });
        yield newPost.save();
        res.status(201).json({ message: 'Post created successfully!', post: newPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Read all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find().populate('user', 'username');
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Read a single post
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.id).populate('user', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Update a post
router.put('/:id', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const post = yield post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (!req.user || post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post.' });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        yield post.save();
        res.json({ message: 'Post updated successfully!', post });
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Delete a post
router.delete('/:id', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (!req.user || post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }
        yield post.deleteOne();
        res.json({ message: 'Post deleted successfully!' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
exports.default = router;
