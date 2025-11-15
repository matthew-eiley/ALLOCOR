Feature: Run Backtesting Simulation
    As a user
    I want to run a backtesting simulation
    So that I can evaluate a portfolio's historical performance

    Scenario: Running a simulation with valid inputs
        Given I have selected valid tickers
        And I have selected a rebalancing method and frequency
        When I start the simulation
        Then the simulation should run successfully
        And I should see a message that the simulation is in progress

    Scenario: Running a simulation with missing portfolio data
        Given I have not added any tickers
        When I start the simulation
        Then I should see an error message indicating that tickers are required

    Scenario: Running a simulation with incomplete rebalancing settings
        Given I selected tickers
        And I have not selected a rebalancing frequency
        When I start the simulation
        Then I should see an error message indicating that rebalancing settings are incomplete