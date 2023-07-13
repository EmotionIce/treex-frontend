import { SettingsService, Settings } from './settings';

describe('Settings', () => {
  it('should create an instance', () => {
    let settingsService = new SettingsService();
    expect(settingsService.getSettings()).toBeTruthy();
  });
});
