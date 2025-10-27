import express from 'express';
import { getAccountDetails } from '../controllers/accountController.js';

const router = express.Router();


router.get('/:id', getAccountDetails);

export default router;
