//import
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { config as dotenvConfig } from 'dotenv';
import stripeRoutes from './routes/stripe.routes.js';
import userRoutes from '.routes/user.routes.js'
import authRoutes from '.routes/auth.routes.js'
import bestsellingRoutes from './routes/bestselling.routes.js';
import cartRoutes from './routes/cart.routes.js';
import authRoutes from './routes/auth.routes.js';

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
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/stripe', stripeRoutes);
app.use('/bestselling', bestsellingRoutes);
app.use('/cart', cartRoutes);
server.use('/auth', authRoutes);

export default app;
