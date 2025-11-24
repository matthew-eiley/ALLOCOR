import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Weekly backtest endpoint', () => {
  it('runs weekly backtest and returns values series', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest')
      .send({ frequency: 'weekly', startDate: '2024-09-01', endDate: '2024-12-01' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('output');
    const out = res.body.output;
    expect(out).toHaveProperty('portfolioId', '1');
    expect(Array.isArray(out.values)).toBe(true);
    expect(out.values.length).toBeGreaterThan(0);
    // first and last dates should be within requested range
    expect(out.values[0].date >= '2024-09-01').toBe(true);
    expect(out.values[out.values.length - 1].date <= '2024-12-01').toBe(true);
  });
});
