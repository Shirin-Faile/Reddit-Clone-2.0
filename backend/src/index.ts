import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./db";
import authRoutes from './routes/auth'
import postRoutes from './routes/post'

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
console.log('Auth routes loaded');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello, Reddit Clone!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});