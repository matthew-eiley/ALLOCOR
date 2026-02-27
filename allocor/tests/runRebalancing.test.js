import { describe, test, expect } from 'vitest';
import { saveRebalancingSettings } from '../server/services/rebalanceService.js';

const buildConfig = (overrides = {}) => ({
  method: 'Threshold Rebalancing',
  frequency: 'Monthly',
  ...overrides,
});

describe('ID010 Rebalancing Method and Frequency acceptance', () => {

  test('Scenario: Selecting a valid rebalancing method and frequency', () => {
    const config = buildConfig();

    const result = saveRebalancingSettings(config);

    expect(result.status).toBe('saved');
    expect(result.settings).toEqual({
      method: 'Threshold Rebalancing',
      frequency: 'Monthly'
    });
  });

  test('Scenario: Selecting an unsupported rebalancing method', () => {
    const config = buildConfig({ method: 'UnsupportedMethod' });

    expect(() => saveRebalancingSettings(config))
      .toThrow(/method is not supported/i);
  });

  test('Scenario: Saving settings without selecting required fields', () => {
    const config = buildConfig({ frequency: undefined });

    expect(() => saveRebalancingSettings(config))
      .toThrow(/frequency is required/i);
  });

});
