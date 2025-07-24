import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/add', addToCart);
router.delete('/remove', removeFromCart);
router.put('/update-quantity', updateQuantity);
router.delete('/clear/:userId', clearCart);

export default router;
