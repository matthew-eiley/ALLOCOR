Feature: Register User

    As a new user
    I want to register an account
    So that I can access the system's features

    Scenario: Successful registration with valid details
        Given I am on the registration page
        When I fill in the registration form with the following details:
        | Username    | newuser    |
        | Email      | user@example.com |
        | Password   | SecurePass123! |
        | Confirm Password | SecurePass123! |
        And I submit the registration form
        Then I should see a confirmation message
        And my account should be created in the system

    Scenario: Registration with an already used email
        Given I am on the registration page
        And an account with email "user@example.com" already exists
        When I enter "user@example.com" as my email
        And I submit the registration form
        Then I should see an error message indicating the email is already in use

    Scenario: Registration with invalid password
        Given I am on the registration page
        When I enter a password that does not meet the requirements
        And I submit the registration form
        Then I should see an error message indicating the password requirements

    Scenario: Registration with missing required fields
        Given I am on the registration page
        When I leave the email field blank
        And I submit the registration form
        Then I should see an error message indicating that email is required
