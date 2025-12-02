import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Backtest input validation and error handling', () => {
  it('returns 400 when frequency is missing', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest')
      .send({ startDate: '2024-09-01', endDate: '2024-10-01' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for unsupported frequency', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest')
      .send({ frequency: 'monthly', startDate: '2024-09-01', endDate: '2024-10-01' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid date ordering', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest')
      .send({ frequency: 'weekly', startDate: '2024-10-01', endDate: '2024-09-01' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('endDate must be >= startDate');
  });
});
