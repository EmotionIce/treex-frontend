import { Component } from '@angular/core';
import { Settings, SettingsService } from '../services/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  settings: Settings;

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.getSettings();
  }

  /**
   * Updates the settings
   */
  updateSettings() {
    // Call this method when the user changes settings
    this.settingsService.updateSettings(this.settings);
  }
}
