Feature: Select Rebalancing Method and Frequency
    As a user
    I want to select a rebalancing method and a rebalancing frequency
    So that the simulation reflects my chosen strategy

    Scenario: Selecting a valid rebalancing method and frequency
        Given I am on the rebalancing settings page
        When I choose "Threshold Rebalancing" as the method
        And I choose "Monthly" as the frequency
        And I save the settings
        Then the rebalancing settings should be stored

    Scenario: Selecting an unsupported rebalancing method
        Given I am on the rebalancing settings page
        When I choose "UnsupportedMethod" as the method
        And I save the settings
        Then I should see an error message indicating the method is not supported

    Scenario: Saving settings without selecting required fields
        Given I am on the rebalancing settings page
        When I leave the frequency field empty
        And I save the settings
        Then I should see an error message indicating frequency is required