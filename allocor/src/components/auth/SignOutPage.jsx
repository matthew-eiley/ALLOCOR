import React, { useState } from "react"
import "./styles.scss"

export default function SignOutPage() {
  const [loggedOut, setLoggedOut] = useState(false)

  const handleLogout = () => {
    setLoggedOut(true)
  }

  return (
    <div className="signout-page">
      <div className="signout-container">
        {!loggedOut ? (
          <div className="signout-content fade-in">
            <div className="text-section">
              <h1>Welcome back</h1>
              <p>Ready to sign out of your session?</p>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              <span className="button-text">Sign Out</span>
              <div className="button-glow" />
            </button>
          </div>
        ) : (
          <div className="signout-content fade-in">
            <div className="checkmark scale-in">
              <svg
                className="checkmark-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="text-section">
              <h2>Successfully signed out</h2>
              <p>Your session has been securely ended. See you next time.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
