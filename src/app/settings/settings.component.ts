import { Component, Renderer2, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Settings, SettingsService } from '../services/settings.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  settings: Settings;
  tempHostingPort: number;
  tempPopupDuration: number;

  constructor(
    private settingsService: SettingsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.settings = this.settingsService.getSettings();
    this.tempHostingPort = this.settings.hostingPort;
    this.tempPopupDuration = this.settings.popupDuration;
    this.applyTheme();
  }

  /**
   * Updates the settings
   */
  updateSettings() {
    let hasChanged = false;
    let newSettings: Settings = { ...this.settings }; // Clone the settings object

    if (this.tempHostingPort !== newSettings.hostingPort) {
      newSettings.hostingPort = this.tempHostingPort;
      hasChanged = true;
    }
    if (this.tempPopupDuration !== newSettings.popupDuration) {
      newSettings.popupDuration = this.tempPopupDuration;
      hasChanged = true;
    }

    if (hasChanged) {
      this.settingsService.updateSettings(newSettings); // Update the settings in the service
      this.settings = newSettings; // Update the settings in the component
      this.applyTheme();
    }
  }

  /**
   * Apply the current theme to the body
   */
  private applyTheme() {
    if (!this.settings) return;
    if (this.settings.theme === 'dark') {
      this.renderer.removeClass(this.document.body, 'light-theme');
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      this.renderer.addClass(this.document.body, 'light-theme');
    }
  }

  /**
   * Close the settings
   */
  closeSettings() {
    this.renderer.setStyle(
      this.document.querySelector('app-settings'),
      'display',
      'none'
    );
  }
}
