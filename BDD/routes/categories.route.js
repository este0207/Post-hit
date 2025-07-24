
import express from 'express';
import { getAllCategorie, 
    addCategorie
 } from '../controllers/categories.controller.js';

const router = express.Router();

router.get("/", getAllCategorie);
router.post("/", addCategorie);

export default router;
