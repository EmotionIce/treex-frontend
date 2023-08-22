import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Service class that manages and provides access to the error popup.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorPopupService {
  private errorSubject = new Subject<string>();

  constructor() {}

  /**
   * Lets the error popup display an error message
   * 
   * @param message the error message to be displayed
   */
  setErrorMessage(message: string) {
    this.errorSubject.next(message);
  }

  /**
   * lets the error popup retrieve the error message
   * 
   * @returns the error message as an observable
   */
  getErrorMessage(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
