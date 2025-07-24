
import express from 'express';
import { getAllUsers, 
    getUserById, 
    updateUser, 
    suppUser, 
    addUser,
    suppAllUsers,
    getUserByEmail,
    login
 } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.post('/signup', addUser);
router.post('/login', login);
router.put('/:id', updateUser);
router.delete('/', suppUser);
// router.delete('/drop-table', suppAllUsers);

export default router;
