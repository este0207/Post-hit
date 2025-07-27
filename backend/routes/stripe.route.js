
import express from 'express';
import { createCheckoutSession, 
 } from '../controllers/stripe.controller.js';

const router = express.Router();

router.get("/create-checkout-session", createCheckoutSession);





export default router;
