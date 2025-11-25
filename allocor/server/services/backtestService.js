// Backtest service - implements weekly rebalance logic and returns time series of portfolio values

function parseDateISO(d) {
  return new Date(d + 'T00:00:00Z');
}

function formatDate(dt) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getPriceOnDate(priceSeries, date) {
  const rec = priceSeries.find(p => p.date === date);
  return rec ? rec.close : null;
}

// Run a simple weekly backtest: at each weekly step rebalance holdings to target allocations
export function runWeeklyBacktest(portfolio, pricesBySymbol, startDate, endDate) {
  if (!portfolio) throw new Error('Portfolio required');
  const start = parseDateISO(startDate);
  const end = parseDateISO(endDate);
  if (isNaN(start) || isNaN(end)) throw new Error('Invalid dates');
  if (end < start) throw new Error('endDate must be >= startDate');

  // Initialize current holdings from portfolio.currentHoldings (allow fractional shares)
  const symbols = Array.from(new Set([
    ...portfolio.currentHoldings.map(h => h.symbol),
    ...portfolio.targetAllocations.map(t => t.symbol)
  ]));

  // Ensure prices exist for all symbols
  for (const s of symbols) {
    if (!pricesBySymbol[s] || !Array.isArray(pricesBySymbol[s]) || pricesBySymbol[s].length === 0) {
      throw new Error(`Missing price series for ${s}`);
    }
  }

  // map holdings to fractional shares based on price at startDate
  const dateStrStart = formatDate(start);
  const holdings = {};
  for (const h of portfolio.currentHoldings) {
    const price = getPriceOnDate(pricesBySymbol[h.symbol], dateStrStart);
    if (price == null) throw new Error(`Missing price for ${h.symbol} on ${dateStrStart}`);
    // if the model provided a currentPrice/shares, prefer provided shares; keep them as starting shares
    holdings[h.symbol] = h.shares;
  }

  // For any target symbol not currently held, start with 0 shares
  for (const t of portfolio.targetAllocations) {
    if (holdings[t.symbol] == null) holdings[t.symbol] = 0;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const results = [];

  // iterate weekly from start to end inclusive. We'll sample weekly on same weekday as start.
  let current = new Date(start.getTime());
  while (current <= end) {
    const dateStr = formatDate(current);

    // compute portfolio value at this date
    let totalValue = 0;
    for (const sym of Object.keys(holdings)) {
      const price = getPriceOnDate(pricesBySymbol[sym], dateStr);
      if (price == null) throw new Error(`Missing price for ${sym} on ${dateStr}`);
      totalValue += holdings[sym] * price;
    }

    // Record pre-rebalance value
    results.push({ date: dateStr, value: +totalValue.toFixed(2) });

    // Rebalance - compute target shares (allow fractional)
    for (const tgt of portfolio.targetAllocations) {
      const targetPct = tgt.targetPercent / 100;
      const price = getPriceOnDate(pricesBySymbol[tgt.symbol], dateStr);
      if (price == null) throw new Error(`Missing price for ${tgt.symbol} on ${dateStr}`);
      const targetValue = totalValue * targetPct;
      const targetShares = targetValue / price;
      holdings[tgt.symbol] = targetShares;
    }

    // advance one week
    current = new Date(current.getTime() + 7 * msPerDay);
  }

  return {
    portfolioId: portfolio.id,
    portfolioName: portfolio.name,
    values: results
  };
}

// Run a quarterly backtest: rebalances only every 3 months
export function runQuarterlyBacktest(portfolio, pricesBySymbol, startDate, endDate) {
  if (!portfolio) throw new Error("Portfolio required");
  const start = parseDateISO(startDate);
  const end = parseDateISO(endDate);
  if (isNaN(start) || isNaN(end)) throw new Error("Invalid dates");
  if (end < start) throw new Error("endDate must be >= startDate");

  // Build symbol set
  const symbols = Array.from(new Set([
    ...portfolio.currentHoldings.map(h => h.symbol),
    ...portfolio.targetAllocations.map(t => t.symbol)
  ]));

  // Validate price series exist
  for (const s of symbols) {
    if (!pricesBySymbol[s] || !Array.isArray(pricesBySymbol[s]) || pricesBySymbol[s].length === 0) {
      throw new Error(`Missing price series for ${s}`);
    }
  }

  // Initialize holdings from portfolio (fractional allowed)
  const dateStrStart = formatDate(start);
  const holdings = {};
  for (const h of portfolio.currentHoldings) {
    const price = getPriceOnDate(pricesBySymbol[h.symbol], dateStrStart);
    if (price == null) throw new Error(`Missing price for ${h.symbol} on ${dateStrStart}`);
    holdings[h.symbol] = h.shares;
  }
  for (const t of portfolio.targetAllocations) {
    if (holdings[t.symbol] == null) holdings[t.symbol] = 0;
  }

  const results = [];
  const msPerDay = 24 * 60 * 60 * 1000;

  let current = new Date(start.getTime());
  let lastRebalanced = new Date(start.getTime());

  while (current <= end) {
    const dateStr = formatDate(current);

    // compute portfolio value for this date
    let totalValue = 0;
    for (const sym of Object.keys(holdings)) {
      const price = getPriceOnDate(pricesBySymbol[sym], dateStr);
      if (price == null) throw new Error(`Missing price for ${sym} on ${dateStr}`);
      totalValue += holdings[sym] * price;
    }

    // record value (pre-rebalance)
    results.push({ date: dateStr, value: Number(totalValue.toFixed(2)) });

    // check months passed since lastRebalanced
    const monthsPassed =
      (current.getUTCFullYear() - lastRebalanced.getUTCFullYear()) * 12 +
      (current.getUTCMonth() - lastRebalanced.getUTCMonth());

    if (monthsPassed >= 3) {
      // perform rebalance to target allocations (fractional shares allowed)
      for (const tgt of portfolio.targetAllocations) {
        const targetPct = tgt.targetPercent / 100;
        const price = getPriceOnDate(pricesBySymbol[tgt.symbol], dateStr);
        if (price == null) throw new Error(`Missing price for ${tgt.symbol} on ${dateStr}`);
        const targetValue = totalValue * targetPct;
        const targetShares = targetValue / price;
        holdings[tgt.symbol] = targetShares;
      }
      lastRebalanced = new Date(current.getTime());
    }

    current = new Date(current.getTime() + msPerDay);
  }

  return {
    portfolioId: portfolio.id,
    portfolioName: portfolio.name,
    values: results
  };
}


export default { runWeeklyBacktest, runQuarterlyBacktest };
