import express from 'express';
import { serveImage } from '../controllers/images.controller.js';

const router = express.Router();

router.get('/:filename', serveImage);

export default router;
