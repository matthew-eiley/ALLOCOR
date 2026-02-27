// Service for calculating portfolio rebalancing recommendations

/**
 * Calculates the current portfolio value and allocation percentages
 * @param {Array} holdings - Array of current holdings with {symbol, shares, currentPrice}
 * @returns {Object} - {totalValue, allocations: [{symbol, value, percent}]}
 */
export function calculateCurrentAllocations(holdings) {
  const totalValue = holdings.reduce((sum, holding) => {
    return sum + (holding.shares * holding.currentPrice);
  }, 0);

  const allocations = holdings.map(holding => ({
    symbol: holding.symbol,
    value: holding.shares * holding.currentPrice,
    percent: totalValue > 0 ? ((holding.shares * holding.currentPrice) / totalValue) * 100 : 0
  }));

  return { totalValue, allocations };
}

/**
 * Calculates rebalancing recommendations based on target allocations
 * @param {Array} targetAllocations - Array of {symbol, targetPercent}
 * @param {Array} currentHoldings - Array of {symbol, shares, currentPrice}
 * @param {Number} totalValue - Total portfolio value
 * @returns {Array} - Rebalancing recommendations [{symbol, action, shares, value, currentPercent, targetPercent}]
 */
export function calculateRebalanceRecommendations(targetAllocations, currentHoldings, totalValue) {
  const recommendations = [];

  // Create a map of current holdings for easy lookup
  const holdingsMap = new Map(
    currentHoldings.map(h => [h.symbol, h])
  );

  // Calculate recommendations for each target allocation
  targetAllocations.forEach(target => {
    const currentHolding = holdingsMap.get(target.symbol);

    if (!currentHolding) {
      // Stock not in portfolio - need to buy
      const targetValue = (target.targetPercent / 100) * totalValue;
      recommendations.push({
        symbol: target.symbol,
        action: 'BUY',
        shares: 0,
        targetShares: 0,
        value: targetValue,
        currentPercent: 0,
        targetPercent: target.targetPercent,
        message: `Add ${target.symbol} to portfolio (not currently held)`
      });
      return;
    }

    const currentValue = currentHolding.shares * currentHolding.currentPrice;
    const currentPercent = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    const targetValue = (target.targetPercent / 100) * totalValue;
    const difference = targetValue - currentValue;
    const percentDiff = currentPercent - target.targetPercent;

    // Calculate shares to buy or sell
    const sharesToAdjust = Math.abs(Math.round(difference / currentHolding.currentPrice));
    const targetShares = Math.round(targetValue / currentHolding.currentPrice);

    if (Math.abs(percentDiff) < 1) {
      // Within 1% tolerance - no action needed
      recommendations.push({
        symbol: target.symbol,
        action: 'HOLD',
        shares: currentHolding.shares,
        targetShares: targetShares,
        value: 0,
        currentPercent: currentPercent,
        targetPercent: target.targetPercent,
        message: `${target.symbol} is within target range (${currentPercent.toFixed(2)}% vs ${target.targetPercent}%)`
      });
    } else if (difference > 0) {
      // Need to buy more
      recommendations.push({
        symbol: target.symbol,
        action: 'BUY',
        shares: sharesToAdjust,
        targetShares: targetShares,
        value: Math.abs(difference),
        currentPercent: currentPercent,
        targetPercent: target.targetPercent,
        message: `Buy ${sharesToAdjust} shares to increase from ${currentPercent.toFixed(2)}% to ${target.targetPercent}%`
      });
    } else {
      // Need to sell
      recommendations.push({
        symbol: target.symbol,
        action: 'SELL',
        shares: sharesToAdjust,
        targetShares: targetShares,
        value: Math.abs(difference),
        currentPercent: currentPercent,
        targetPercent: target.targetPercent,
        message: `Sell ${sharesToAdjust} shares to decrease from ${currentPercent.toFixed(2)}% to ${target.targetPercent}%`
      });
    }
  });

  return recommendations;
}

/**
 * Main rebalancing function that calculates full rebalancing plan
 * @param {Object} portfolio - Portfolio object with targetAllocations and currentHoldings
 * @returns {Object} - Rebalancing plan with current state, recommendations, and summary
 */
export function calculateRebalancePlan(portfolio) {
  const { totalValue, allocations } = calculateCurrentAllocations(portfolio.currentHoldings);

  const recommendations = calculateRebalanceRecommendations(
    portfolio.targetAllocations,
    portfolio.currentHoldings,
    totalValue
  );

  const summary = {
    totalValue: totalValue,
    needsRebalancing: recommendations.some(r => r.action !== 'HOLD'),
    actionCount: recommendations.filter(r => r.action !== 'HOLD').length,
    lastRebalanced: portfolio.lastRebalanced
  };

  return {
    portfolioId: portfolio.id,
    portfolioName: portfolio.name,
    currentAllocations: allocations,
    recommendations: recommendations,
    summary: summary,
    timestamp: new Date().toISOString()
  };
}

/**
 * Simulates applying rebalance recommendations to a portfolio
 * This would integrate with an external broker API in production
 * @param {Object} portfolio - Portfolio object
 * @param {Array} recommendations - Array of rebalancing recommendations
 * @returns {Object} - Updated portfolio with new holdings
 */
export function applyRebalanceRecommendations(portfolio, recommendations) {
  const updatedHoldings = [...portfolio.currentHoldings];

  recommendations.forEach(rec => {
    if (rec.action === 'HOLD') return;

    const holdingIndex = updatedHoldings.findIndex(h => h.symbol === rec.symbol);

    if (rec.action === 'BUY') {
      if (holdingIndex === -1) {
        // Add new holding (in real implementation, would need price from API)
        updatedHoldings.push({
          symbol: rec.symbol,
          shares: rec.targetShares,
          currentPrice: 0 // Would be fetched from external API
        });
      } else {
        // Increase shares
        updatedHoldings[holdingIndex].shares += rec.shares;
      }
    } else if (rec.action === 'SELL' && holdingIndex !== -1) {
      // Decrease shares
      updatedHoldings[holdingIndex].shares -= rec.shares;
      if (updatedHoldings[holdingIndex].shares <= 0) {
        // Remove holding if all shares sold
        updatedHoldings.splice(holdingIndex, 1);
      }
    }
  });

  return {
    ...portfolio,
    currentHoldings: updatedHoldings,
    lastRebalanced: new Date().toISOString()
  };
}

/**
 * Checks whether a quarterly rebalance is due
 * @param {String} lastRebalanced - ISO timestamp of last rebalance
 * @param {String} currentDate - ISO timestamp (usually today's date)
 * @returns {Boolean}
 */
export function isQuarterlyRebalanceDue(lastRebalanced, currentDate = new Date().toISOString()) {
  if (!lastRebalanced) return true;

  const last = new Date(lastRebalanced);
  const current = new Date(currentDate);

  const diffMonths =
    (current.getFullYear() - last.getFullYear()) * 12 +
    (current.getMonth() - last.getMonth());

  return diffMonths >= 3;
}

/**
 * Executes quarterly rebalance logic
 * @param {Object} portfolio - Portfolio object with holdings, targets, lastRebalanced, etc.
 * @param {String} currentDate - ISO string for simulated or actual date
 * @returns {Object} - { shouldRebalance, rebalancePlan or reason }
 */
export function calculateQuarterlyRebalance(portfolio, currentDate = new Date().toISOString()) {
  const due = isQuarterlyRebalanceDue(portfolio.lastRebalanced, currentDate);

  if (!due) {
    return {
      shouldRebalance: false,
      reason: `Quarterly rebalance not due yet. Last rebalanced: ${portfolio.lastRebalanced}`,
      nextAllowedRebalance: computeNextQuarterDate(portfolio.lastRebalanced)
    };
  }

  const plan = calculateRebalancePlan(portfolio);

  return {
    shouldRebalance: true,
    rebalancePlan: plan
  };
}

/**
 * Utility: compute next allowed rebalance date (3 months later)
 */
export function computeNextQuarterDate(lastRebalanced) {
  if (!lastRebalanced) return null;

  const d = new Date(lastRebalanced);
  d.setMonth(d.getMonth() + 3);
  return d.toISOString();
}

// Allowed methods and frequencies
const SUPPORTED_METHODS = ['Threshold Rebalancing', 'Calendar Rebalancing'];
const SUPPORTED_FREQUENCIES = ['Monthly', 'Quarterly', 'Weekly'];

export function saveRebalancingSettings({ method, frequency }) {
  if (!method) throw new Error('Rebalancing method is required');
  if (!frequency) throw new Error('Frequency is required');

  if (!SUPPORTED_METHODS.includes(method)) {
    throw new Error('Rebalancing method is not supported');
  }

  if (!SUPPORTED_FREQUENCIES.includes(frequency)) {
    throw new Error('Frequency is not supported');
  }

  return {
    status: 'saved',
    settings: { method, frequency }
  };
}


export default {
  calculateCurrentAllocations,
  calculateRebalanceRecommendations,
  calculateRebalancePlan,
  applyRebalanceRecommendations
};
