import { Component, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Settings, SettingsService } from '../services/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  settings: Settings;

  constructor(
    private settingsService: SettingsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.settings = this.settingsService.getSettings();
    this.applyTheme();
  }

  /**
   * Updates the settings
   */
  updateSettings() {
    this.settingsService.updateSettings(this.settings);
    this.applyTheme();
  }

  /**
   * Apply the current theme to the body
   */
  private applyTheme() {
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
    this.renderer.setStyle(this.document.querySelector('app-settings'), 'display', 'none');
  }
}
