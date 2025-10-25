import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import assert from 'assert';
import { app, users } from '../../index.js';

let response;

Before(() => {
  // reset users to default initial state before each scenario
  users.length = 0;
  users.push(
    {
      username: 'testuser',
      email: 'test@test.com',
      fullName: 'Test User',
      createdAt: '2024-01-01T12:00:00Z',
      roles: ['user']
    },
    {
      username: 'jane',
      email: 'user@example.com',
      fullName: 'Jane Example',
      createdAt: '2024-06-15T09:30:00Z',
      roles: ['user']
    }
  );
  response = null;
});

Given('the server has been reset', function () {
  // noop - handled in Before hook
});

Given('a user exists with email {string}', async function (email) {
  users.push({ username: 'existing', email: email.toLowerCase(), fullName: 'Existing', createdAt: new Date().toISOString(), roles: ['user'] });
});

When('I register with username {string} email {string} and password {string}', async function (username, email, password) {
  response = await request(app).post('/api/register').send({ username, email, password });
});

Then('the response status should be {int}', function (status) {
  assert.strictEqual(response.status, status);
});

Then('the response should contain the email {string}', function (email) {
  assert.strictEqual(response.body.email, email);
});

Then('the response message should contain {string}', function (message) {
  assert.ok(response.body.message && response.body.message.includes(message));
});

Then('the response should contain a validation error for {string}', function (field) {
  assert.strictEqual(response.status, 400);
  assert.ok(response.body.errors && response.body.errors[field]);
});
