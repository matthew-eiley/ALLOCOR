const { Before, After } = require('@cucumber/cucumber');

let scenarioCount = 0;

Before(function (scenario) {
  // Reset the context for each scenario
  this.ctx = {
    tickers: [],
    weighting: null,
    rebalancing: null,
    dataAvailable: true,
    partialData: false,
    backtestRun: false,
    results: null,
    error: null
  };

  scenarioCount++;
  console.log(`\nStarting Scenario #${scenarioCount}: ${scenario.pickle.name}`);
});

After(function (scenario) {
  const status = scenario.result.status.toUpperCase();
  console.log(`Finished Scenario #${scenarioCount}: ${scenario.pickle.name} [${status}]`);
});
