import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Portfolio Rebalancing API', () => {
  describe('GET /api/portfolios/:id', () => {
    it('returns a portfolio by id', async () => {
      const res = await request(app).get('/api/portfolios/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', '1');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('targetAllocations');
      expect(res.body).toHaveProperty('currentHoldings');
      expect(res.body).toHaveProperty('lastRebalanced');
    });

    it('returns 404 for non-existent portfolio', async () => {
      const res = await request(app).get('/api/portfolios/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/portfolios/user/:userId', () => {
    it('returns all portfolios for a user', async () => {
      const res = await request(app).get('/api/portfolios/user/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('portfolios');
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.portfolios)).toBe(true);
      expect(res.body.portfolios.length).toBeGreaterThan(0);
    });

    it('returns empty array for user with no portfolios', async () => {
      const res = await request(app).get('/api/portfolios/user/999');
      expect(res.status).toBe(200);
      expect(res.body.portfolios).toEqual([]);
      expect(res.body.count).toBe(0);
    });
  });

  describe('GET /api/portfolios/:id/rebalance/calculate', () => {
    it('calculates rebalance plan for a portfolio', async () => {
      const res = await request(app).get('/api/portfolios/1/rebalance/calculate');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('plan');

      const plan = res.body.plan;
      expect(plan).toHaveProperty('portfolioId', '1');
      expect(plan).toHaveProperty('portfolioName');
      expect(plan).toHaveProperty('currentAllocations');
      expect(plan).toHaveProperty('recommendations');
      expect(plan).toHaveProperty('summary');

      expect(Array.isArray(plan.currentAllocations)).toBe(true);
      expect(Array.isArray(plan.recommendations)).toBe(true);

      expect(plan.summary).toHaveProperty('totalValue');
      expect(plan.summary).toHaveProperty('needsRebalancing');
      expect(plan.summary).toHaveProperty('actionCount');
    });

    it('includes action recommendations with required fields', async () => {
      const res = await request(app).get('/api/portfolios/1/rebalance/calculate');
      expect(res.status).toBe(200);

      const recommendations = res.body.plan.recommendations;
      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('symbol');
        expect(rec).toHaveProperty('action');
        expect(['BUY', 'SELL', 'HOLD']).toContain(rec.action);
        expect(rec).toHaveProperty('currentPercent');
        expect(rec).toHaveProperty('targetPercent');
        expect(rec).toHaveProperty('message');
      });
    });

    it('returns 404 for non-existent portfolio', async () => {
      const res = await request(app).get('/api/portfolios/999/rebalance/calculate');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/portfolios/:id/rebalance/execute', () => {
    it('executes rebalance in dry run mode', async () => {
      const res = await request(app)
        .post('/api/portfolios/1/rebalance/execute')
        .send({ dryRun: true });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('plan');
      expect(res.body).toHaveProperty('executed', false);
    });

    it('executes rebalance and updates portfolio', async () => {
      const res = await request(app)
        .post('/api/portfolios/1/rebalance/execute')
        .send({ dryRun: false });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('plan');

      if (res.body.plan.summary.needsRebalancing) {
        expect(res.body).toHaveProperty('executed', true);
        expect(res.body).toHaveProperty('updatedPortfolio');
        expect(res.body.updatedPortfolio).toHaveProperty('lastRebalanced');
      } else {
        expect(res.body).toHaveProperty('executed', false);
      }
    });

    it('handles portfolio already balanced', async () => {
      // First rebalance
      await request(app)
        .post('/api/portfolios/1/rebalance/execute')
        .send({ dryRun: false });

      // Check if still needs rebalancing
      const calcRes = await request(app).get('/api/portfolios/1/rebalance/calculate');

      if (!calcRes.body.plan.summary.needsRebalancing) {
        const res = await request(app)
          .post('/api/portfolios/1/rebalance/execute')
          .send({ dryRun: false });

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('already balanced');
        expect(res.body.executed).toBe(false);
      }
    });

    it('returns 404 for non-existent portfolio', async () => {
      const res = await request(app)
        .post('/api/portfolios/999/rebalance/execute')
        .send({ dryRun: true });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
