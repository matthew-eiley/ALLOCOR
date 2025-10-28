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


describe('PUT /api/accounts/:id', () => {
  it('successfully updates account name, email, and bio', async () => {
    const res = await request(app)
      .put('/api/accounts/1')
      .send({
        email: 'updated@example.com',
        name: 'Updated Alice',
        profile: { bio: 'Updated bio for Alice' },
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Account updated successfully');
    expect(res.body.account).toHaveProperty('email', 'updated@example.com');
    expect(res.body.account).toHaveProperty('name', 'Updated Alice');
    expect(res.body.account.profile).toHaveProperty('bio', 'Updated bio for Alice');
  });

  it('returns 409 when trying to update with a duplicate email', async () => {
    const res = await request(app)
      .put('/api/accounts/1')
      .send({
        email: 'bob@example.com',
        name: 'Alice Duplicate',
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email is already in use');
  });

  it('returns 404 when trying to update a non-existing account', async () => {
    const res = await request(app)
      .put('/api/accounts/999')
      .send({
        email: 'ghost@example.com',
        name: 'Ghost User',
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Account not found');
  });
});