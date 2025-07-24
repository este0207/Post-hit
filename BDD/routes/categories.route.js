
import express from 'express';
import { getAllCategories, 
    addCategorie
 } from '../controllers/categories.controller.js';

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", addCategorie);

export default router;
