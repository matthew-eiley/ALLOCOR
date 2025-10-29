import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const accountController = require('../controllers/accountController.cjs');

const { getAccountDetails, updateAccountDetails } = accountController;

const router = express.Router();

router.get('/:id', getAccountDetails);
router.put('/:id', updateAccountDetails);

export default router;
