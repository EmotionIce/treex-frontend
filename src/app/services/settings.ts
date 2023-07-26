import { Injectable } from '@angular/core';
import { DataService } from './data.service';

export interface Settings {
  theme: string;
  hideLeavesTree: boolean;
  deleteCascading: boolean;
  hideComments: boolean;
  hideSummaries: boolean;
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
    popupDuration: 5000,
  };

  constructor(private dataService: DataService) {
    // Try to load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  getSettings(): Settings {
    return this.settings;
  }

  updateSettings(newSettings: Partial<Settings>) {
    this.settings = { ...this.settings, ...newSettings };
    // Save the updated settings to localStorage
    localStorage.setItem('settings', JSON.stringify(this.settings));
    // Notify the data service that the data has changed
    this.dataService.notifyChange();
  }
}
