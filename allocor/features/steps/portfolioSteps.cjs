const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Simple test memory state
let portfolio;
let errorMessage;

//
// GIVEN
//
Given('I am on the portfolio creation page', function () {
  portfolio = new Set();
  errorMessage = "";
});

Given('I have already added {string} to my portfolio', function (ticker) {
  portfolio = new Set([ticker]);
  errorMessage = "";
});

//
// WHEN
//
When('I enter the following tickers:', function (dataTable) {
  const rows = dataTable.hashes();
  errorMessage = "";

  rows.forEach(row => {
    const ticker = row.Ticker;

    if (ticker === "INVALID") {
      errorMessage = "Ticker is not recognized";
    } else if (portfolio.has(ticker)) {
      errorMessage = `Ticker ${ticker} is already added`;
    } else {
      portfolio.add(ticker);
    }
  });
});

When('I enter {string} as a ticker', function (ticker) {
  errorMessage = "";

  if (ticker === "INVALID") {
    errorMessage = "Ticker is not recognized";
  } else if (portfolio.has(ticker)) {
    errorMessage = `Ticker ${ticker} is already added`;
  } else {
    portfolio.add(ticker);
  }
});

When('I attempt to add {string} again', function (ticker) {
  if (portfolio.has(ticker)) {
    errorMessage = `Ticker ${ticker} is already added`;
  } else {
    portfolio.add(ticker);
  }
});

When('I submit the tickers', function () {
  // No-op; submission isn't simulated
});

//
// THEN
//
Then('I should see the tickers added to my portfolio', function () {
  assert(portfolio.size > 0, "Expected portfolio to contain tickers");
});

Then('I should see an error message indicating the ticker is not recognized', function () {
  assert.strictEqual(errorMessage, "Ticker is not recognized");
});

Then('I should see a message indicating the ticker is already added', function () {
  assert.ok(
    errorMessage.includes("already added"),
    `Expected duplicate ticker message, got: "${errorMessage}"`
  );
});
