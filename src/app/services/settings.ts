import { Injectable } from '@angular/core';
import { DataService } from './data.service';

export interface Settings {
  theme: string;
  hideLeavesTree: boolean;
  deleteCascading: boolean;
  hideComments: boolean;
  hideSummaries: boolean;
  exportComment: boolean;
  exportSummary: boolean;
  popupDuration: number;
  // Other settings go here
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
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
  };

  constructor(private dataService: DataService) {
    // Try to load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }
  /**
   * Get the current settings
   * 
   * @returns the current settings
   */
  getSettings(): Settings {
    return this.settings;
  }

  /**
   * Save the given settings as the new settings
   * 
   * @param newSettings the new settings
   */
  updateSettings(newSettings: Partial<Settings>) {
    this.settings = { ...this.settings, ...newSettings };
    // Save the updated settings to localStorage
    localStorage.setItem('settings', JSON.stringify(this.settings));
    // Notify the data service that the data has changed
    this.dataService.notifyChange();
  }
}
