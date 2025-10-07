Feature: Delete User Account

    As an administrator
    I want to delete a user account
    So that I can manage user access and maintain system security

    Background:
        Given the following users exist:
            | username   | email              | role          |
            | johndoe    | john@example.com   | user          |
            | janedoe    | jane@example.com   | administrator |

    Scenario: Successfully delete an existing user
        Given I am logged in as an administrator
        When I delete the user with username "johndoe"
        Then the user "johndoe" should no longer exist in the system
        And I should see a confirmation message "User deleted successfully"

    Scenario: Attempt to delete a non-existent user
        Given I am logged in as an administrator
        When I delete the user with username "nonexistentuser"
        Then I should see an error message "User not found"

    Scenario: Non-administrator tries to delete a user
        Given I am logged in as "johndoe"
        When I attempt to delete the user with username "janedoe"
        Then I should see an error message "Permission denied"