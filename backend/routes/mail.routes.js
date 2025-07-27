
import express from 'express';
import {
  sendWelcomeMail,
  sendContactMail,
} from '../controllers/mail.controller.js';

const router = express.Router();

router.post('/welcome', sendWelcomeMail);
router.post('/contact', sendContactMail);

export default router;
