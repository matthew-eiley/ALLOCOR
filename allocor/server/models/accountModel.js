// Simple in-memory account model for demo/unit tests
const accounts = [
  {
    id: '1',
    name: 'Alice Example',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
    profile: { bio: 'Front-end developer' }
  },
  {
    id: '2',
    name: 'Bob Example',
    email: 'bob@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    profile: { bio: 'Project manager' }
  }
];

export function findAccountById(id) {
  return accounts.find((a) => a.id === String(id));
}

export function listAccounts() {
  return accounts.slice();
}

export function updateAccountById(id, data) {
  const account = accounts.find((a) => a.id === String(id));
  if (!account) return null;

  if (data.email && accounts.some((a) => a.email === data.email && a.id !== String(id))) {
    throw new Error('DUPLICATE_EMAIL');
  }

  if (data.email) account.email = data.email;
  if (data.name) account.name = data.name;
  if (data.profile?.bio) account.profile.bio = data.profile.bio;

  return account;
}


export default { findAccountById, listAccounts, updateAccountById, accounts };
