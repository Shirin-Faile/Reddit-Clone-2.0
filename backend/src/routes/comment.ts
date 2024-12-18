import express, { Request, Response } from 'express';
import Comment from '../models/comment';
import Post from '../models/post';
import verifyToken, { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new comment
router.post('/:postId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID.' });
        }

        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.'});
        }

        const newComment = new Comment({
            content,
            user: req.user.id,
            post: postId
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully.', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all comments for a post
router.get('/:postId', async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        
        const comments = await Comment.find({ post: postId })
        .populate('user', 'username')
        .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments.', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

//Delete a comment
router.delete('/:commentId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment.' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment.', error);
        res.status(500).json({ messagee: 'Server error.' });
    }
});

export default router;