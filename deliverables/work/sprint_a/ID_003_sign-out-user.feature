Feature: Sign out user

    As a registered user
    I want to be able to sign out of my account
    So that my session is securely terminated

    Scenario: User successfully signs out
        Given the user is logged in
        When the user clicks the "Sign Out" button
        Then the user should be logged out
        And the user should be redirected to the login page

    Scenario: User tries to access a protected page after signing out
        Given the user has signed out
        When the user tries to access a protected page
        Then the user should be redirected to the login page
        And the user should see a message "Please log in to continue"