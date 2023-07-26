import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, interval, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

// import composite structure
import { Element } from '../models/element';
import { Parent } from '../models/parent';

import { SettingsService, Settings } from './settings';
import { ErrorPopupService } from './error-popup.service';
import { DataService } from './data.service';

const POLLING_INTERVAL = 5000; // Time in milliseconds between each poll

@Injectable({
  providedIn: 'root', //so every other dependencies can access this service
})
export class BackendService {
  private baseUrl = 'http://localhost:8080'; //localhost connection to backend; actual url will be 8080 apparently
  private settings: Settings;
  private stopPolling$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private errorPopupService: ErrorPopupService,
    private dataService: DataService
  ) {
    this.settings = settingsService.getSettings();
    this.handleError = this.handleError.bind(this);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public Export(): Observable<any> {
    return this.http
      .get<Array<Object>>(`${this.baseUrl}/Export`)
      .pipe(catchError(this.handleError));
  }

  public LoadTree(): Observable<Array<Object>> {
    return this.http
      .get<Array<Object>>(`${this.baseUrl}/LoadTreeData`)
      .pipe(catchError(this.handleError));
  }

  public LoadFullData(): Observable<Array<Object>> {
    return this.http
      .get<Array<Object>>(`${this.baseUrl}/LoadFullData`)
      .pipe(catchError(this.handleError));
  }

  public CheckForUpdates(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/CheckForUpdates`)
      .pipe(catchError(this.handleError));
  }

  public MoveElementTree(
    e: string,
    p: string,
    pc: string | null
  ): Observable<Array<Object>> {
    let moveData: Object = {
      element: e,
      newParent: p,
      previousElement: pc,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { MoveElementTree: moveData })
      .pipe(catchError(this.handleError));
  }

  public MoveElementEditor(
    e: Element,
    p: Parent,
    pc: Element
  ): Observable<Object> {
    let moveData: Object = {
      element: e.getId(),
      newParent: p.getId(),
      previousElement: pc.getId(),
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, {
        MoveElementEditor: moveData,
      })
      .pipe(catchError(this.handleError));
  }

  public EditSummary(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      summary: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditSummary: editData })
      .pipe(catchError(this.handleError));
  }

  public EditComment(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      comment: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditComment: editData })
      .pipe(catchError(this.handleError));
  }

  public EditContent(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      content: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditContent: editData })
      .pipe(catchError(this.handleError));
  }

  public DeleteElement(e: Element, s: string): Observable<Object> {
    let delData: Object = {
      element: e.getId(),
      cascading: this.settings.deleteCascading,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { DeleteElement: delData })
      .pipe(catchError(this.handleError));
  }

  public LoadFromFolder(destination: string): Observable<Object> {
    let folderData: Object = {
      path: destination,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { LoadFromFolder: folderData })
      .pipe(catchError(this.handleError));
  }

  public LoadFromGit(
    url: string,
    user: string,
    pass: string,
    path: string
  ): Observable<Object> {
    let gitData: Object = {
      url: url,
      username: user,
      password: pass,
      path: path,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { LoadFromGit: gitData })
      .pipe(catchError(this.handleError));
  }

  public startPollingData(): void {
    interval(POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.CheckForUpdates()), // Ensures that checkForUpdates() is called each interval
        takeUntil(this.stopPolling$) // Stops polling when a value is emitted from stopPolling$
      )
      .subscribe({
        next: (hasUpdates: boolean) => {
          // If backend returns true, log true to the console
          if (hasUpdates) {
            this.dataService.notifyChange();
          }
        },
        error: (err) => {
          console.error(err);
          // Handle any errors that occur during the request
        },
      });
  }

  public stopPollingData(): void {
    // Emitting a value from stopPolling$ will cause the interval Observable to complete.
    this.stopPolling$.next();
    // Clear the stopPolling$ subject to ensure no leftover values
    this.stopPolling$.complete();
    // Recreate the stopPolling$ subject for future use
    this.stopPolling$ = new Subject();
  }

  // helper function to handle backend errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      errorMessage = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error.error}`;
      if(error.status == 0) errorMessage = "Backend not reachable. Please check your connection or start the server.";
    }
    // Use the ErrorPopupService to display the error message
    this.errorPopupService.setErrorMessage(errorMessage);

    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
