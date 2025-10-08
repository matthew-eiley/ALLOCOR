Feature: Delete User Account

    As a user
    I want to delete a user account
    So that I can remove my personal data from the system

    Background:
        Given the following users exist:
            | username   | email              | 
            | johndoe    | john@example.com   | 
            | janedoe    | jane@example.com   | 

    Scenario: Successfully delete an existing user
        Given I am logged in as johndoe
        When I delete my account
        Then my account should be removed from the system
        And I should see a confirmation message "Account deleted successfully"
        And I should be redirected to the sign-in page

    Scenario: Confirm account deletion with password
        Given I am logged in as johndoe
        When I attempt to delete my account
        And I enter my password "password123" to confirm
        Then my account should be removed from the system
        And I should see a confirmation message "Account deleted successfully"
        And I should be redirected to the sign-in page

    Scenario: Account deleetion with incorrect password
        Given I am logged in as "johndoe"
        When I attempt to delete my account
        And I enter my password "wrongpassword" to confirm
        Then my account should not be removed from the system
        And I should see an error message "Incorrect password"