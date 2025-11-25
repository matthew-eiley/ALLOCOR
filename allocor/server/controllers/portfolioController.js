import { findPortfolioById, findPortfoliosByUserId, updatePortfolio } from '../models/portfolioModel.js';
import { calculateRebalancePlan, applyRebalanceRecommendations } from '../services/rebalanceService.js';

/**
 * Get portfolio by ID
 */
export async function getPortfolio(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing portfolio id parameter' });
  }

  try {
    const portfolio = findPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    return res.status(200).json(portfolio);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}

/**
 * Get all portfolios for a user
 */
export async function getUserPortfolios(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  try {
    const portfolios = findPortfoliosByUserId(userId);
    return res.status(200).json({ portfolios, count: portfolios.length });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}

/**
 * Calculate rebalance plan for a portfolio (monthly rebalance logic)
 * This endpoint analyzes the portfolio and returns recommendations
 */
export async function calculateRebalance(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing portfolio id parameter' });
  }

  try {
    const portfolio = findPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Calculate the rebalancing plan
    const rebalancePlan = calculateRebalancePlan(portfolio);

    return res.status(200).json({
      message: 'Rebalance plan calculated successfully',
      plan: rebalancePlan
    });
  } catch (err) {
    console.error('Error calculating rebalance:', err);
    return res.status(500).json({ error: 'Error calculating rebalance plan' });
  }
}

/**
 * Execute rebalance for a portfolio
 * This endpoint applies the rebalancing recommendations
 * In production, this would integrate with broker APIs to execute trades
 */
export async function executeRebalance(req, res) {
  const { id } = req.params;
  const { dryRun = false } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing portfolio id parameter' });
  }

  try {
    const portfolio = findPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Calculate the rebalancing plan
    const rebalancePlan = calculateRebalancePlan(portfolio);

    if (!rebalancePlan.summary.needsRebalancing) {
      return res.status(200).json({
        message: 'Portfolio is already balanced',
        plan: rebalancePlan,
        executed: false
      });
    }

    if (dryRun) {
      // Dry run - just return the plan without executing
      return res.status(200).json({
        message: 'Dry run completed - no trades executed',
        plan: rebalancePlan,
        executed: false
      });
    }

    // Apply the rebalancing (in production, this would call broker API)
    const updatedPortfolio = applyRebalanceRecommendations(
      portfolio,
      rebalancePlan.recommendations
    );

    // Update the portfolio in storage
    updatePortfolio(id, updatedPortfolio);

    return res.status(200).json({
      message: 'Portfolio rebalanced successfully',
      plan: rebalancePlan,
      executed: true,
      updatedPortfolio: updatedPortfolio
    });
  } catch (err) {
    console.error('Error executing rebalance:', err);
    return res.status(500).json({ error: 'Error executing rebalance' });
  }
}

export default {
  getPortfolio,
  getUserPortfolios,
  calculateRebalance,
  executeRebalance
};
