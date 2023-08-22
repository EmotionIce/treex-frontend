import { Component, OnInit } from '@angular/core';
import { ErrorPopupService } from '../services/error-popup.service';
import { Settings, SettingsService } from '../services/settings.service';

/**
 * Component responsible for displaying error popups.
 */
@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopupComponent implements OnInit {
  /**
   * The current error message to be displayed.
   */
  private errorMessage: string | null = null;

  /**
   * The application settings.
   */
  private settings: Settings;

  /**
   * Constructs the ErrorPopupComponent.
   *
   * @param errorPopupService {ErrorPopupService} service to manage error popups
   * @param settingsService {SettingsService} service to manage application settings
   */
  constructor(
    private errorPopupService: ErrorPopupService,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
  }

  /**
   * Subscribes to the error message observable from the ErrorPopupService and sets the error message.
   * It also defines a timeout to clear the error message based on the popup duration from the settings.
   */
  ngOnInit(): void {
    this.errorPopupService.getErrorMessage().subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
      if (errorMessage) {
        setTimeout(() => {
          this.errorMessage = null;
        }, this.settings.popupDuration * 1000);
      }
    });
  }

  /**
   * Retrieves the current error message.
   *
   * @returns {string | null} the current error message
   */
  public getErrorMessage(): string | null {
    return this.errorMessage;
  }
}
