
import express from 'express';
import { getAllProducts, 
    getProductById, 
    // getProductSize,
    // searchProducts,
    addProduct
 } from '../controllers/products.controller.js';

const router = express.Router();

router.get("/", getAllProducts);
// router.get("/size", getProductSize);
router.post("/", addProduct);
router.get("/:id", getProductById);
router.put("/:id", getProductById);
router.delete("/:id", getProductById);
// router.get("/search", searchProducts);




export default router;
