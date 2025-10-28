import express from 'express';
import { getAccountDetails, updateAccountDetails, signOutUser } from '../controllers/accountController.js';

const router = express.Router();

router.get('/:id', getAccountDetails);
router.put('/:id', updateAccountDetails);

router.post('/signout', signOutUser);

export default router;
