import express from 'express';
import {
  getPortfolio,
  getUserPortfolios,
  calculateRebalance,
  executeRebalance
} from '../controllers/portfolioController.js';

const router = express.Router();

// Get specific portfolio by ID
router.get('/:id', getPortfolio);

// Get all portfolios for a user
router.get('/user/:userId', getUserPortfolios);

// Calculate rebalance plan for a portfolio (monthly rebalance logic)
router.get('/:id/rebalance/calculate', calculateRebalance);

// Execute rebalance for a portfolio
router.post('/:id/rebalance/execute', executeRebalance);

export default router;
