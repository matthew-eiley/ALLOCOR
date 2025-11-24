Feature: Persist User Sessions
    As a returning user
    I want my session to persist
    So that I remain logged in across visits

    Scenario: Session persists after closing and reopening the browser
        Given I am logged in
        And my session token is valid
        When I close and reopen the browser
        Then I should still be logged in
        And I should be redirected to the dashboard

    Scenario: Session expires after timeout
        Given I am logged in
        And my session has expired
        When I refresh the page
        Then I should be redirected to the login page
        And I should see a message indicating the session expired

    Scenario: Logging out clears the session
        Given I am logged in
        When I click the logout button
        Then my session should be cleared
        And I should be redirected to the login page