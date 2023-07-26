import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreeViewSummaryService {
  private summaryText = "";

  constructor() { }

  setSummaryText(newSummary: string){
    this.summaryText = newSummary;
  }

  getSummaryText(): string {
    return this.summaryText;
  }
  
}


//import { Subject, Observable } from 'rxjs';


//export class ErrorPopupService {
  //private errorSubject = new Subject<string>();

/*
  setErrorMessage(message: string) {
    this.errorSubject.next(message);
  }

  getErrorMessage(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}*/