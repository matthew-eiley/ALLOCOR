import React from 'react';
import './SignOutButton.scss';

export default function SignOutButton({ onSignOut }) {
  const handleSignOut = async () => {

    // Clear client session
    await fetch('/api/accounts/signout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');

    // Notify parent or trigger API call
    if (onSignOut) onSignOut();
  };

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
