Feature: Display portfolio value chart over time
  The Allocor application allows users to input tickers, select weighting schemes,
  choose rebalancing frequency, and run historical backtests.  
  This feature ensures that users can view a visual chart of their portfolio value
  across the selected date range.

  Background:
    Given the user is logged into the Allocor application
    And the user has navigated to the portfolio analysis page

  Scenario: Successful display of portfolio value chart
    Given the user enters valid stock tickers
    And the user selects a valid weighting scheme
    And the user selects a valid rebalancing frequency
    And historical price data is available for all tickers
    When the user runs the backtest
    Then the system computes portfolio weights using the selected scheme
    And the system applies the selected rebalancing logic
    And the system calculates the portfolio value across the full historical range
    And the system displays a line chart showing portfolio value over time
    And the system displays summary metrics such as cumulative return, volatility, and Sharpe ratio

  Scenario: Display chart with partial or limited historical data (alternative flow)
    Given the user enters valid stock tickers
    And the user selects a valid weighting scheme
    And the available historical data for one or more tickers does not cover the full requested range
    When the user runs the backtest
    Then the system computes returns using only the overlapping data range
    And the system displays the portfolio value chart for the available period
    And the system shows a non-intrusive notice indicating that some data was unavailable
    And summary metrics are computed only for the available period

  Scenario: Failure to display chart due to invalid inputs or missing data
    Given the user enters invalid or unsupported stock tickers
    Or the user selects an incomplete or invalid weighting or rebalancing option
    Or historical data for the selected tickers cannot be retrieved
    When the user runs the backtest
    Then the system does not compute portfolio performance
    And the system displays an error message describing what must be fixed
    And the portfolio value chart is not displayed
    And no performance metrics are generated
