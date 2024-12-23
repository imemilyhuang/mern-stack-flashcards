import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import db from './db/connection.js';

dotenv.config({ path: './config.env' });

const app = express();

// middleware
app.use(cors());
app.use(express.json());



import authRoutes from "./controllers/authController.js";
import flashcardRoutes from "./controllers/flashcardController.js";

app.use("/api/auth", authRoutes);
app.use('/api/flashcards', flashcardRoutes);

// express server
const PORT = process.env.PORT || 5060;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
