
import express from 'express';
import { getAllProducts, 
    getProductById, 
    addProduct
 } from '../controllers/products.controller.js';

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", addProduct);
router.get("/:id", getProductById);
router.put("/:id", getProductById);
router.delete("/:id", getProductById);

export default router;
