import { Component, OnInit } from '@angular/core';
import { ErrorPopupService } from '../services/error-popup.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(private errorPopupService: ErrorPopupService) {}

  ngOnInit(): void {
    this.errorPopupService.getErrorMessage().subscribe(errorMessage => {
      this.errorMessage = errorMessage;
      if(errorMessage){
        setTimeout(() => {
          this.errorMessage = null;
        }, 10000);
      }
    });
  }
}
