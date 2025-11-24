import { findAccountById } from '../models/accountModel.js';

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

export default { getAccountDetails };
