// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import de la BDD
import db from './config/db.js';

// Import des routes
import productRoutes from './routes/products.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.route.js';
import categoryRoutes from './routes/categories.route.js';
import imageRoutes from './routes/image.routes.js';
import stripeRoutes from './routes/stripe.route.js';
import mailRoutes from './routes/mail.routes.js';
import bestsellingRoutes from './routes/bestselling.route.js';
import authRoutes from './routes/auth.routes.js';

// Init App
const app = express();
dotenv.config();

// Détection de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à la BDD
db.connect(err => {
  if (err) {
    console.error("Erreur de connexion à la BDD:", err.message);
  } else {
    console.log("✅ Connecté à la base de données");
  }
});

// Middlewares globaux
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public'))); 

// Routes (centralisation)
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/categories', categoryRoutes);
app.use('/images', imageRoutes);
app.use('/stripe', stripeRoutes);
app.use('/mail', mailRoutes);
app.use('/bestselling', bestsellingRoutes);
app.use('/auth', authRoutes);

// Page d’accueil simple (optionnel)
app.get('/', (req, res) => {
  res.send('API Post\'hit en ligne !');
});

// 404 - route non trouvée
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

export default app;
