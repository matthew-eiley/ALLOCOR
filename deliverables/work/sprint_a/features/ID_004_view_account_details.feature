Feature: View Account Details

    As a registered user
    I want to view my account details
    So that I can verify and manage my personal information

    Scenario: User views their account details successfully
        Given I am logged into my account
        When I navigate to the account details page
        Then I should see my account information including name, email, and contact details

    Scenario: User tries to view account details without logging in
        Given I am not logged into my account
        When I try to access the account details page
        Then I should be redirected to the login page

    Scenario: User updates their account details
        Given I am logged into my account
        When I update my account information
        And I save the changes
        Then my updated account details should be displayed