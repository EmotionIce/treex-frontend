import { SettingsService, Settings } from './settings.service';
import { DataService } from './data.service';

describe('Settings', () => {
  it('should create an instance', () => {
    let settingsService = new SettingsService(new DataService());
    expect(settingsService.getSettings()).toBeTruthy();
  });
});
