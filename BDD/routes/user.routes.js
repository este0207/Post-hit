
import express from 'express';
import { getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    signUp,
    // suppAllUsers,
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
// router.delete('/drop-table', suppAllUsers);

export default router;
