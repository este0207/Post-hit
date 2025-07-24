import express from 'express';
import { serveImage } from '../controllers/images.controller.js';

const router = express.Router();

router.get('/images/:filename', serveImage);

export default router;
