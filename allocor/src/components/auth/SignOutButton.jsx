import React from 'react';
import './SignOutButton.scss';

export default function SignOutButton({ onSignOut }) {
  const handleSignOut = () => {
    
    // Clear client session
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
