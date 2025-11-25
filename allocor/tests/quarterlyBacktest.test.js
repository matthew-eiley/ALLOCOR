import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Quarterly backtest endpoint', () => {
  it('runs quarterly backtest and returns values series', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest')
      .send({ frequency: 'quarterly', startDate: '2024-01-01', endDate: '2024-12-31' });

    // basic response checks
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('output');

    const out = res.body.output;

    // main output structure checks
    expect(out).toHaveProperty('portfolioId', '1');
    expect(Array.isArray(out.values)).toBe(true);
    expect(out.values.length).toBeGreaterThan(0);

    // first and last dates are within range
    expect(out.values[0].date >= '2024-01-01').toBe(true);
    expect(out.values[out.values.length - 1].date <= '2024-12-31').toBe(true);

    const dates = out.values.map(v => v.date);

    const hasQ1 = dates.some(d => d.startsWith('2024-03'));
    const hasQ2 = dates.some(d => d.startsWith('2024-06'));
    const hasQ3 = dates.some(d => d.startsWith('2024-09'));
    const hasQ4 = dates.some(d => d.startsWith('2024-12'));

    expect(hasQ1).toBe(true);
    expect(hasQ2).toBe(true);
    expect(hasQ3).toBe(true);
    expect(hasQ4).toBe(true);
  });
});
