Feature: Reset user password
  As a registered user
  I want to reset my password if I forget it
  So that I can regain access to my account securely

  Scenario: Successfully reset password via email link
    Given the user has an existing account
    And the user is on the "Forgot Password" page
    When the user enters their registered email address
    Then the system sends a password reset email
    And the email contains a secure reset link

  Scenario: Reset password with valid token
    Given the user clicks the valid password reset link
    When the user enters a new valid password
    And confirms it
    Then the system updates the user’s password
    And displays a success message
    And the user can log in with the new password

  Scenario: Attempt reset with invalid or expired token
    Given the user clicks an invalid or expired password reset link
    When the user tries to set a new password
    Then the system rejects the request
    And displays an error message saying "Link expired or invalid"
