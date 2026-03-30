import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from './config/db';
import { seedDefaultRules } from './models/Rule';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB().then(() => {
    seedDefaultRules();
});

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('MERN DPI Engine Backend Running');
});

// Create uploads and outputs folder if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('outputs')) {
    fs.mkdirSync('outputs');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
