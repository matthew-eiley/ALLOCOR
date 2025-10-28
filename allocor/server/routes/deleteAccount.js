// allocor/server/routes/deleteAccount.js
import express from "express";
import { deleteAccount } from "../controllers/deleteAccountController.js";

const router = express.Router();

// DELETE /api/account/delete
router.delete("/", deleteAccount);

export default router;

