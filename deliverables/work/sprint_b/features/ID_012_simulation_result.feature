Feature: View Simulation Results
    As a user
    I want to view the simulation results
    So that I can analyze portfolio performance

    Scenario: Viewing results after a successful simulation
        Given a simulation has been completed
        When I navigate to the results page
        Then I should see performance metrics
        And I should see graphs and visualizations
        And I should see the rebalancing events

    Scenario: Attempting to view results before running a simulation
        Given I have not run a simulation yet
        When I navigate to the results page
        Then I should see a message indicating that no simulation results are available

    Scenario: Viewing results for a failed simulation
        Given a simulation attempt failed
        When I navigate to the results page
        Then I should see an error message explaining the failure