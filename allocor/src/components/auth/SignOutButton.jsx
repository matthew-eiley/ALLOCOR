import React from 'react';
import './SignOutButton.scss';

export default function SignOutButton({ onSignOut }) {
    const handleSignOut = async () => {
    try {
        await fetch('/api/accounts/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        });

        // Clear local session
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');

        if (onSignOut) onSignOut();
    } catch (error) {
        console.error('Sign out failed:', error);
    }
    };

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

