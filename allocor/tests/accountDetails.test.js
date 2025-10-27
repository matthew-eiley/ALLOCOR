import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('GET /api/accounts/:id', () => {
  it('returns account details for an existing account', async () => {
    const res = await request(app).get('/api/accounts/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
    expect(res.body).toHaveProperty('email', 'alice@example.com');
    expect(res.body).toHaveProperty('name');
  });

  it('returns 404 for a non-existing account', async () => {
    const res = await request(app).get('/api/accounts/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
