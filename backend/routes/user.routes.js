
import express from 'express';
import { getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    signUp,
    getUserByEmail,
    login
 } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.post('/signup', signUp);
router.post('/login', login);
router.put('/:id', updateUser);
router.delete('/', deleteUser);

export default router;
