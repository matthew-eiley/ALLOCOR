import { findAccountById, accounts, listAccounts } from '../models/accountModel.js';

export async function getAccountDetails(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing account id parameter' });
  }
  try {
    const account = findAccountById(id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    return res.status(200).json({ ...account });
  } catch (err) {
    
    return res.status(500).json({ error: 'Unexpected error' });
  }
}


export async function updateAccountDetails(req, res) {
  try {
    const { id } = req.params;
    const { name, email, profile } = req.body;

    const account = findAccountById(id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const duplicate = listAccounts().find(a => a.email === email && a.id !== id);
    if (duplicate) {
      return res.status(409).json({ error: 'Email is already in use' });
    }


    if (name) account.name = name;
    if (email) account.email = email;
    if (profile?.bio) account.profile.bio = profile.bio;

    return res.status(200).json({ message: 'Account updated successfully', account });
  } catch (err) {
    console.error('Update account error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}

export async function signOutUser(req, res) {
  try {
    res.clearCookie('authToken');
    return res.status(200).json({ message: 'User signed out successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Error signing out user' });
  }
}

export default { getAccountDetails, updateAccountDetails, signOutUser };
