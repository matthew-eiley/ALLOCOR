Feature: Update User Details

    As a registered user
    I want to update my personal information and preferences
    So that my account details and portfolio settings remain accurate and up to date

    Background:
        Given the following user exist:
        | username   | email              | 
        | johndoe    | john@example.com   | 

    Senario: Successfully update username with valid information
        Given I am logged in as johndoe
        When I update my details with the following information:
        | username   | email              | 
        | janedoe    | jane@example.com   | 
        And I save the changes
        Then I should see a success message indicating my details have been updated
        And my updated information should be reflected on the profile page

    Scenario: Attempt to update details with a duplicated username
        Given another username with "janedoe" already exists
        When I try to change my username to "janedoe"
        And I save the changes
        Then I should see an error message indicating the username is already in use
