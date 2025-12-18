import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth'
import userRoutes from "./routes/user"
import officeBoyRoutes from "./routes/office-boy"
import './jobs/daily-reset';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use('/auth',authRoutes)
app.use('/user',userRoutes)
app.use('/office-boy',officeBoyRoutes)


// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
