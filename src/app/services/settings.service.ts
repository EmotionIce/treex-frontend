import { Injectable } from '@angular/core';
import { DataService } from './data.service';

/**
 * Interface for the application's settings.
 */
export interface Settings {
  theme: string;
  hideLeavesTree: boolean;
  deleteCascading: boolean;
  hideComments: boolean;
  hideSummaries: boolean;
  exportComment: boolean;
  exportSummary: boolean;
  popupDuration: number;
  hostingPort: number;
  showAdvancedSettings: boolean;
  // Other settings go here
}

/**
 * Service responsible for managing application settings.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /**
   * The current settings for the application.
   */
  settings: Settings = {
    // default values
    theme: 'dark',
    hideLeavesTree: false,
    deleteCascading: false,
    hideComments: false,
    hideSummaries: false,
    exportComment: true,
    exportSummary: true,
    popupDuration: 5,
    hostingPort: 8090,
    showAdvancedSettings: false,
  };

  /**
   * Constructs the SettingsService with the given data service. Loads settings from localStorage if available.
   *
   * @param dataService Service to handle data notifications
   */
  constructor(private dataService: DataService) {
    // Try to load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.settings = {
        ...this.settings, // Keep default settings
        ...JSON.parse(savedSettings), // Override with saved settings
      };
    }
  }

  /**
   * Retrieves the current settings.
   *
   * @returns {Settings} the current settings
   */
  getSettings(): Settings {
    return this.settings;
  }

  /**
   * Updates and saves the settings with the given values.
   *
   * @param newSettings {Partial<Settings>} the new settings to apply
   */
  updateSettings(newSettings: Partial<Settings>) {
    // Check if hostingPort has changed
    if (
      newSettings.hasOwnProperty('hostingPort') &&
      this.settings.hostingPort !== newSettings.hostingPort
    ) {
      this.dataService.updateHostingPort(newSettings.hostingPort!);
      console.log('Hosting port changed to ' + newSettings.hostingPort!);
    }

    this.settings = { ...this.settings, ...newSettings };
    // Save the updated settings to localStorage
    localStorage.setItem('settings', JSON.stringify(this.settings));
    // Notify the data service that the data has changed
    this.dataService.notifyChange();
  }
}
