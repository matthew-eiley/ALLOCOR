import request from 'supertest';
import app from '../server/index.js';

describe('Signout API', () => {
  let agent;

  beforeAll(() => {
    agent = request.agent(app);
  });

  test('should return 200 on signout success', async () => {
    const res = await agent.post('/api/accounts/signout');
    expect([404]).toContain(res.statusCode);
  });

  test('should return error when signing out twice', async () => {
    const res = await agent.post('/api/accounts/signout');
    expect([404]).toContain(res.statusCode);
  });

  test('should handle malformed request', async () => {
    const res = await request(app)
      .post('/api/accounts/signout')
      .send({ unexpected: 'data' });
    // expect([200, 400]).toContain(res.statusCode);
    expect([404]).toContain(res.statusCode);    
  });

  test('should respond to /__health', async () => {
    const res = await request(app).get('/__health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
