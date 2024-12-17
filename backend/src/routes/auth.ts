import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' });
      }

// Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

// Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

// Create a new user
        const newUser = new User ({
            username,
            password: hashedPassword,
        });

// Save to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;