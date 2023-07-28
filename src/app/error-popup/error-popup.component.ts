import { Component, OnInit } from '@angular/core';
import { ErrorPopupService } from '../services/error-popup.service';
import { Settings, SettingsService } from '../services/settings';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopupComponent implements OnInit {
  private errorMessage: string | null = null;
  private settings: Settings;

  constructor(
    private errorPopupService: ErrorPopupService,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
  }
  
  /**
   * Subscribes to the error message observable and sets the error message
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

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }
}
