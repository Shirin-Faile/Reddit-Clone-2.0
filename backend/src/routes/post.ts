import express, { Request, Response } from 'express';
import Post from '../models/post';
import verifyToken, { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new post
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newPost = new Post({
            title,
            content,
            user: req.user.id
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Read all posts
router.get('/', async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.json(posts);
     } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
     }
});

// Read a single post
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update a post
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response ) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

// Check if the logged-in user is the owner of the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post.'});
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();
        res.json({ message: 'Post updated successfully!', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete a post
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;