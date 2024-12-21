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
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Create a new comment
router.post('/:postId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const { postId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID.' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }
        const post = yield post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const newComment = new comment_1.default({
            content,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            post: postId,
        });
        yield newComment.save();
        res.status(201).json({ message: 'Comment added successfully.', comment: newComment });
    }
    catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Get all comments for a post
router.get('/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = yield comment_1.default.find({ post: postId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        console.error('Error fetching comments.', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Edit a comment
router.put('/:commentId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }
        const comment = yield comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        // Allow only the comment author to edit the comment
        if (comment.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(403).json({ message: 'Not authorized to edit this comment.' });
        }
        comment.content = content;
        yield comment.save();
        res.json({ message: 'Comment updated successfully.', comment });
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
// Delete a comment
router.delete('/:commentId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. No user found.' });
        }
        const comment = yield comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        const post = yield post_1.default.findById(comment.post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Allow only the comment author or the post author to delete the comment
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment.' });
        }
        yield comment.deleteOne();
        res.json({ message: 'Comment deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}));
exports.default = router;
