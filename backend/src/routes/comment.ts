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
            return res.status(404).json({ message: 'Post not found.' });
        }

        const newComment = new Comment({
            content,
            user: req.user?.id,
            post: postId,
        });

        const savedComment = await newComment.save();

        // Populate the user field to include username
        const populatedComment = await savedComment.populate('user', 'username');

        // Debugging logs for backend
        console.log('Saved Comment:', savedComment);
        console.log('Populated Comment:', populatedComment);

        res.status(201).json({ message: 'Comment added successfully.', comment: populatedComment });
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
            .populate('user', 'username') // Populate user to get the username
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments.', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Edit a comment
router.put('/:commentId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Allow only the comment author to edit the comment
        if (comment.user.toString() !== req.user?.id) {
            return res.status(403).json({ message: 'Not authorized to edit this comment.' });
        }

        comment.content = content;
        const updatedComment = await comment.save();

        // Populate user field to include the username in the response
        const populatedComment = await updatedComment.populate('user', 'username');

        res.json({ message: 'Comment updated successfully.', comment: populatedComment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete a comment
router.delete('/:commentId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. No user found.' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Allow only the comment author or the post author to delete the comment
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment.' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;
