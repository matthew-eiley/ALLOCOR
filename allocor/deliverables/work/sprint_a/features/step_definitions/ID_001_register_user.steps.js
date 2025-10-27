import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import assert from 'assert';
import { app, users } from '../../../../../server/index.js';

let context = {};

Before(() => {
  // ensure a clean user store for these scenarios
  users.length = 0;
  context.payload = {};
  context.response = null;
});

Given('I am on the registration page', function () {
  // UI navigation step — noop for API tests
});

When('I fill in the registration form with the following details:', async function (dataTable) {
  const rows = dataTable.rowsHash();
  context.payload.username = rows['Username']?.trim();
  context.payload.email = rows['Email']?.trim();
  context.payload.password = rows['Password']?.trim();
  context.payload.confirmPassword = rows['Confirm Password']?.trim();
});

When('I submit the registration form', async function () {
  // Submit: call the backend register endpoint
  // Use username, email, password from payload. confirmPassword is validated on client; server only needs password
  const username = context.payload.username || `user_${Math.random().toString(36).slice(2,8)}`;
  // If the test intentionally set email to an empty string, keep it empty so server-side validation triggers.
  const email = (typeof context.payload.email === 'string') ? context.payload.email : `${username}@example.com`;
  const password = (typeof context.payload.password === 'string') ? context.payload.password : 'Password1';

  context.response = await request(app).post('/api/register').send({
    username,
    email,
    password
  });
});

When('an account with email {string} already exists', async function (email) {
  users.push({ username: 'existing', email: email.toLowerCase(), fullName: 'Existing', createdAt: new Date().toISOString(), roles: ['user'] });
});

When('I enter {string} as my email', async function (email) {
  context.payload.email = email;
});

When('I enter a password that does not meet the requirements', async function () {
  context.payload.password = 'short';
});

When('I leave the email field blank', function () {
  context.payload.email = '';
});

Then('I should see a confirmation message', function () {
  assert.ok(context.response);
  assert.strictEqual(context.response.status, 201);
});

Then('my account should be created in the system', async function () {
  const email = context.payload.email;
  const res = await request(app).get(`/api/account/${encodeURIComponent(email)}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.email, email.toLowerCase());
});

Then('I should see an error message indicating the email is already in use', function () {
  assert.ok(context.response);
  assert.strictEqual(context.response.status, 409);
  assert.ok(context.response.body.message && context.response.body.message.includes('Email already exists'));
});

Then('I should see an error message indicating the password requirements', function () {
  assert.ok(context.response);
  assert.strictEqual(context.response.status, 400);
  assert.ok(context.response.body.errors && context.response.body.errors.password);
});

Then('I should see an error message indicating that email is required', function () {
  assert.ok(context.response);
  assert.strictEqual(context.response.status, 400);
  assert.ok(context.response.body.errors && context.response.body.errors.email && context.response.body.errors.email.includes('required'));
});
