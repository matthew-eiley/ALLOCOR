Feature: Input Stock Tickers
    As a user
    I want to input one or more stock tickers
    So that I can build a portfolio for simulation

    Scenario: Successfully inputting multiple valid tickers
        Given I am on the portfolio creation page
        When I enter the following tickers:
        | Ticker |
        | AAPL   |
        | TSLA   |
        | MSFT   |
        And I submit the tickers
        Then I should see the tickers added to my portfolio

    Scenario: Inputting an invalid ticker
        Given I am on the portfolio creation page
        When I enter "INVALID" as a ticker
        And I submit the tickers
        Then I should see an error message indicating the ticker is not recognized

    Scenario: Adding duplicate tickers
        Given I have already added "AAPL" to my portfolio
        When I attempt to add "AAPL" again
        Then I should see a message indicating the ticker is already added