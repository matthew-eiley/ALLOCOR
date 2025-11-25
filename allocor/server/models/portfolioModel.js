// Portfolio model for stock optimization with target allocations
const portfolios = [
  {
    id: '1',
    userId: '1',
    name: 'Balanced Growth Portfolio',
    targetAllocations: [
      { symbol: 'AAPL', targetPercent: 30 },
      { symbol: 'GOOGL', targetPercent: 25 },
      { symbol: 'MSFT', targetPercent: 25 },
      { symbol: 'AMZN', targetPercent: 20 }
    ],
    currentHoldings: [
      { symbol: 'AAPL', shares: 10, currentPrice: 150 },
      { symbol: 'GOOGL', shares: 15, currentPrice: 100 },
      { symbol: 'MSFT', shares: 8, currentPrice: 200 },
      { symbol: 'AMZN', shares: 12, currentPrice: 140 }
    ],
    lastRebalanced: new Date('2024-10-01').toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    name: 'Tech Heavy Portfolio',
    targetAllocations: [
      { symbol: 'NVDA', targetPercent: 40 },
      { symbol: 'TSLA', targetPercent: 30 },
      { symbol: 'META', targetPercent: 30 }
    ],
    currentHoldings: [
      { symbol: 'NVDA', shares: 20, currentPrice: 450 },
      { symbol: 'TSLA', shares: 25, currentPrice: 250 },
      { symbol: 'META', shares: 15, currentPrice: 300 }
    ],
    lastRebalanced: new Date('2024-09-15').toISOString(),
    createdAt: new Date().toISOString()
  }
];

export function findPortfolioById(id) {
  return portfolios.find((p) => p.id === String(id));
}

export function findPortfoliosByUserId(userId) {
  return portfolios.filter((p) => p.userId === String(userId));
}

export function listPortfolios() {
  return portfolios.slice();
}

export function updatePortfolio(id, updates) {
  const index = portfolios.findIndex((p) => p.id === String(id));
  if (index === -1) return null;

  portfolios[index] = { ...portfolios[index], ...updates };
  return portfolios[index];
}

export default {
  findPortfolioById,
  findPortfoliosByUserId,
  listPortfolios,
  updatePortfolio
};
