import request from 'supertest';
import app from '../server/index.js';
import { describe, it, expect } from 'vitest';

describe('Backend API - health and accounts', () => {
  it('healthcheck returns status ok', async () => {
    const res = await request(app).get('/__health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/accounts/:id returns full account object for existing id', async () => {
    const res = await request(app).get('/api/accounts/1');
    expect(res.status).toBe(200);
    // required fields
    expect(res.body).toHaveProperty('id', '1');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('role');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('createdAt');
    // optional nested profile
    expect(res.body).toHaveProperty('profile');
    if (res.body.profile) {
      expect(res.body.profile).toHaveProperty('bio');
    }
  });

  it('GET /api/accounts/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/accounts/unknown-123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/accounts (no id) returns 404 (route not found)', async () => {
    const res = await request(app).get('/api/accounts');
    // Express will return 404 for a missing route
    expect(res.status).toBe(404);
  });
});
