Feature: Authenticate User

    As a user of the ALLOCOR system
    I want to securely authenticate myself
    So that I can access my personalized features and data

    Background:
        Given the ALLOCOR system is running

    Scenario: Successful login with valid credentials
        Given a registered user with username "user1" and password "password123"
        When the user submits with username "user1" and password "password123"
        Then the user should be authenticated
        And the user should be redirected to the dashboard

    Scenario: Failed login with invalid credentials
        Given a registered user with username "user1" and password "password123"
        When the user submits username "user1" and password "wrongpassword"
        Then the user should not be authenticated
        And an error message "Invalid username or password" should be displayed

    Scenario: Login attempt with missing credentials
        When the user submits the login form without entering username or password
        Then the user should not be authenticated
        And an error message "Username and password are required" should be displayed