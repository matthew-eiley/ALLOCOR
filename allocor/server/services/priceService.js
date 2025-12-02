// Mock historical price service
// Returns deterministic mock daily close prices for a symbol between two dates

function parseDate(d) {
  return new Date(d + 'T00:00:00Z');
}

function formatDate(dt) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Simple hash to produce a reproducible base price per symbol
function symbolBasePrice(symbol) {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) {
    h = (h << 5) - h + symbol.charCodeAt(i);
    h |= 0;
  }
  const base = 50 + (Math.abs(h) % 300); // base between 50 and 349
  return base;
}

export function getMockHistoricalPrices(symbol, startDate, endDate) {
  if (!symbol) throw new Error('Symbol is required');
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (isNaN(start) || isNaN(end)) throw new Error('Invalid startDate or endDate');
  if (end < start) throw new Error('endDate must be >= startDate');

  const base = symbolBasePrice(symbol.toUpperCase());
  const out = [];

  // generate a deterministic daily series using a simple sinusoidal + trend
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round((end - start) / msPerDay) + 1;

  for (let i = 0; i < days; i++) {
    const dt = new Date(start.getTime() + i * msPerDay);
    // weekday skip weekends (still provide values for weekends to keep series simple)
    const seasonal = Math.sin((i % 30) / 30 * Math.PI * 2) * (base * 0.02);
    const trend = (i / 365) * (base * 0.05); // small yearly drift
    // pseudo-random but deterministic noise based on symbol and index
    const noiseSeed = (symbol.charCodeAt(0) || 83) + i * 13;
    const noise = ((Math.abs((noiseSeed * 9301 + 49297) % 233280) / 233280) - 0.5) * (base * 0.01);
    const close = Math.max(1, +(base + seasonal + trend + noise).toFixed(2));

    out.push({ date: formatDate(dt), close });
  }

  return out;
}

export default { getMockHistoricalPrices };
