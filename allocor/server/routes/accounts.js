import express from 'express';
import { getAccountDetails, updateAccountDetails } from '../controllers/accountController.js';

const router = express.Router();


router.get('/:id', getAccountDetails);
router.put('/:id', updateAccountDetails);

export default router;
