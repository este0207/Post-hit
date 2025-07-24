import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';


app.use('/auth', authRoutes);
app.use('/users', userRoutes);


export default app;
