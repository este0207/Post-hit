
import express from 'express';
import { getAllBestselling, 
    getBestsellingById
 } from '../controllers/bestselling.controller.js';

const router = express.Router();

router.get("/", getAllBestselling);
router.get("/:id", getBestsellingById);

export default router;
