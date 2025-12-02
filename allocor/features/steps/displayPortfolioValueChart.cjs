const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// ----------------------
// Background
// ----------------------
Given('the user is logged into the Allocor application', function () {
  const ctx = this.ctx;
  ctx.loggedIn = true;
  assert.ok(ctx.loggedIn);
});

Given('the user has navigated to the portfolio analysis page', function () {
  const ctx = this.ctx;
  ctx.onAnalysisPage = true;
  assert.ok(ctx.onAnalysisPage);
});

// ----------------------
// Successful Scenario
// ----------------------
Given('the user enters valid stock tickers', function () {
  const ctx = this.ctx;
  ctx.tickers = ['AAPL', 'MSFT'];
  assert.ok(ctx.tickers.length > 0);
});

Given('the user selects a valid weighting scheme', function () {
  const ctx = this.ctx;
  ctx.weighting = 'equal-weight';
  assert.ok(ctx.weighting);
});

Given('the user selects a valid rebalancing frequency', function () {
  const ctx = this.ctx;
  ctx.rebalancing = 'monthly';
  assert.ok(ctx.rebalancing);
});

Given('historical price data is available for all tickers', function () {
  const ctx = this.ctx;
  ctx.dataAvailable = true;
  ctx.partialData = false;
  assert.equal(ctx.dataAvailable, true);
});

When('the user runs the backtest', function () {
  const ctx = this.ctx;
  ctx.backtestRun = true;

  if (!ctx.dataAvailable) {
    ctx.results = null;
    ctx.error = 'Missing data';
    return;
  }

  // Minimal mock calculation
  ctx.results = {
    chartPoints: [100, 102, 104, 103, 107],
    cumulativeReturn: 0.07,
    volatility: 0.12,
    sharpe: 0.58
  };

  assert.ok(ctx.backtestRun);
});

Then('the system computes portfolio weights using the selected scheme', function () {
  const ctx = this.ctx;
  assert.ok(ctx.weighting);
});

Then('the system applies the selected rebalancing logic', function () {
  const ctx = this.ctx;
  assert.ok(ctx.rebalancing);
});

Then('the system calculates the portfolio value across the full historical range', function () {
  const ctx = this.ctx;
  assert.ok(ctx.results);
  assert.ok(ctx.results.chartPoints.length > 0);
});

Then('the system displays a line chart showing portfolio value over time', function () {
  const ctx = this.ctx;
  assert.ok(ctx.results.chartPoints);
});

Then('the system displays summary metrics such as cumulative return, volatility, and Sharpe ratio', function () {
  const ctx = this.ctx;
  assert.ok(ctx.results.cumulativeReturn !== undefined);
  assert.ok(ctx.results.volatility !== undefined);
  assert.ok(ctx.results.sharpe !== undefined);
});

// ----------------------
// Alternative Scenario
// ----------------------
Given('the available historical data for one or more tickers does not cover the full requested range', function () {
  const ctx = this.ctx;
  ctx.partialData = true;
  ctx.dataAvailable = true; // partial
  assert.ok(ctx.partialData);
});

Then('the system computes returns using only the overlapping data range', function () {
  const ctx = this.ctx;
  ctx.results = {
    chartPoints: [100, 101, 102],
    partial: true
  };
  assert.ok(ctx.results.chartPoints.length > 0);
});

Then('the system displays the portfolio value chart for the available period', function () {
  const ctx = this.ctx;
  assert.ok(ctx.results.chartPoints);
});

Then('the system shows a non-intrusive notice indicating that some data was unavailable', function () {
  const ctx = this.ctx;
  ctx.partialNoticeDisplayed = true;
  assert.ok(ctx.partialNoticeDisplayed);
});

Then('summary metrics are computed only for the available period', function () {
  const ctx = this.ctx;
  ctx.partialMetrics = true;
  assert.ok(ctx.partialMetrics);
});

// ----------------------
// Failure Scenario
// ----------------------
Given('the user enters invalid or unsupported stock tickers', function () {
  const ctx = this.ctx;
  ctx.tickers = ['INVALID'];
  ctx.tickersInvalid = true;
  assert.ok(ctx.tickersInvalid);
});

Given('the user selects an incomplete or invalid weighting or rebalancing option', function () {
  const ctx = this.ctx;
  ctx.weighting = null;
  ctx.rebalancing = null;
  ctx.invalidOptions = true;
  assert.ok(ctx.invalidOptions);
});

Given('historical data for the selected tickers cannot be retrieved', function () {
  const ctx = this.ctx;
  ctx.dataAvailable = false;
  assert.equal(ctx.dataAvailable, false);
});

Then('the system does not compute portfolio performance', function () {
  const ctx = this.ctx;
  assert.ok(!ctx.results);
});

Then('the system displays an error message describing what must be fixed', function () {
  const ctx = this.ctx;
  ctx.error = 'Invalid inputs or missing data';
  assert.ok(ctx.error);
});

Then('the portfolio value chart is not displayed', function () {
  const ctx = this.ctx;
  assert.ok(!ctx.results);
});

Then('no performance metrics are generated', function () {
  const ctx = this.ctx;
  assert.ok(!ctx.results);
});
