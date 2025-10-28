import request from 'supertest';
import app from '../server/index.js';

describe('POST /api/accounts/signout', () => {
  it('should sign out user successfully', async () => {
    const res = await request(app).post('/api/accounts/signout');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User signed out successfully');
  });

  it('should handle unexpected errors gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockApp = {
      post: jest.fn(() => {
        throw new Error('Mock error');
      }),
    };
    console.error.mockRestore();
  });
});
