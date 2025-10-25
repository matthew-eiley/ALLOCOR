import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

// Simple CORS middleware for local development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Accept JSON bodies
app.use(express.json());

// Mock user database — replace with real DB/API in production
const users = [
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
];

// GET /api/account/:email — returns account details for the given email (case-insensitive)
app.get('/api/account/:email', (req, res) => {
  const emailParam = req.params.email.toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === emailParam);
  if (!user) {
    return res.status(404).json({ message: 'Account not found' });
  }
  // Return a minimal account object
  const account = {
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
    roles: user.roles
  };
  return res.json(account);
});

// POST /api/register — simple registration endpoint (dev only)
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body || {};
  const errors = {};

  if (!username || !username.trim()) errors.username = 'Username is required';
  if (!email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

  const pwd = password || '';
  if (!pwd) errors.password = 'Password is required';
  else {
    if (pwd.length < 8 || pwd.length > 15) errors.password = 'Password must be 8 to 15 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(pwd)) errors.password = (errors.password ? errors.password + ' ' : '') + 'Password must contain both lowercase and uppercase letters';
    if (!/\d/.test(pwd)) errors.password = (errors.password ? errors.password + ' ' : '') + 'Password must contain at least one number';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const newUser = {
    username: username.trim(),
    email: email.toLowerCase(),
    fullName: username.trim(),
    createdAt: new Date().toISOString(),
    roles: ['user']
  };
  users.push(newUser);

  // Return minimal public account info
  return res.status(201).json({ username: newUser.username, email: newUser.email, createdAt: newUser.createdAt });
});

// Only start listening if not running in test mode. Tests will import the `app` directly.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export app and users for tests
export { app, users };
