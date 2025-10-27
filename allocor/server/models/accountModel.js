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

export default { findAccountById, listAccounts };
