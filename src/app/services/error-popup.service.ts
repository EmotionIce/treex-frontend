import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorPopupService {
  private errorSubject = new Subject<string>();

  constructor() {}

  setErrorMessage(message: string) {
    this.errorSubject.next(message);
  }

  getErrorMessage(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
