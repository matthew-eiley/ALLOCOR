import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Backtest export', () => {
  it('returns CSV when export=csv is requested', async () => {
    const res = await request(app)
      .post('/api/portfolios/1/backtest?export=csv')
      .send({ frequency: 'weekly', startDate: '2024-09-01', endDate: '2024-09-22' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('date,value')).toBe(true);
    // at least two lines (header + one data row)
    const lines = res.text.trim().split('\n');
    expect(lines.length).toBeGreaterThan(1);
  });
});
