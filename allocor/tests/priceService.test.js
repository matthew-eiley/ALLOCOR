import { describe, it, expect } from 'vitest';
import priceService from '../server/services/priceService.js';

describe('priceService.getMockHistoricalPrices', () => {
  it('returns daily prices for date range and valid structure', () => {
    const series = priceService.getMockHistoricalPrices('AAPL', '2024-09-01', '2024-09-05');
    expect(Array.isArray(series)).toBe(true);
    expect(series.length).toBe(5);
    series.forEach(item => {
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('close');
      expect(typeof item.close).toBe('number');
    });
    expect(series[0].date).toBe('2024-09-01');
    expect(series[4].date).toBe('2024-09-05');
  });

  it('throws for invalid symbol or dates', () => {
    expect(() => priceService.getMockHistoricalPrices(null, '2024-01-01', '2024-01-02')).toThrow();
    expect(() => priceService.getMockHistoricalPrices('AAPL', 'bad', '2024-01-02')).toThrow();
    expect(() => priceService.getMockHistoricalPrices('AAPL', '2024-01-02', '2024-01-01')).toThrow();
  });
});
