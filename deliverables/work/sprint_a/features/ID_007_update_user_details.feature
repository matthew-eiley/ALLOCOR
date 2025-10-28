Feature: Update Account Details

    As a registered user
    I want to update my account information including my name, email, and bio
    So that my profile remains accurate and reflects my current details

    Background:
        Given the following account exists:
            | id | email             | name      | profile.bio           |
            | 1  | alice@example.com | Alice Doe | Front-end developer   |

    Scenario: Successfully update name, email, and bio with valid information
        Given I am logged in with account ID "1"
        When I update my account details with the following information:
            | email             | name      | profile.bio        |
            | jane@example.com  | Jane Doe  | Product designer   |
        And I save the changes
        Then I should see a success message indicating my account details have been updated
        And my updated information should be preserved

    Scenario: Attempt to update details with a duplicated email
        Given another account with the email "jane@example.com" already exists
        When I try to change my email to "jane@example.com"
        And I save the changes
        Then I should see an error message indicating the email is already in use
