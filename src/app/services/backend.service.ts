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
import { of } from 'rxjs';

const POLLING_INTERVAL = 5000; // Time in milliseconds between each poll

interface ReceivedData{
  tree: any[]
}

@Injectable({
  providedIn: 'root', //so every other dependencies can access this service
})
export class BackendService {
  
 // private fullData: any = {"editor":[{"id":"4208cb1b-1931-4910-ba11-90b88bbbdd67","type":"Sectioning","parent":"null","content":"test_2","comment":"labidabidoo","summary":"null","chooseManualSummary":false,"children":[{"id":"5857bba5-43bf-410a-a179-44a2ed5dad8e","type":"Child","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"fbc4d2ab-a104-45fa-9254-d9af044e8e0a","type":"Environment","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"86ea2265-92de-495c-8366-987c9cea8037","type":"Child","parent":"fbc4d2ab-a104-45fa-9254-d9af044e8e0a","content":null,"comment":"","summary":"null","chooseManualSummary":false}]},{"id":"5c94fde3-1e51-4390-84cb-da1b7150938b","type":"Child","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"0cb69158-ed8b-4942-b479-ae030105f926","type":"Environment","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":"algorithm","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"55c315f9-173a-4fd7-b2ea-161d66c0a8c5","type":"Child","parent":"0cb69158-ed8b-4942-b479-ae030105f926","content":null,"comment":"","summary":"null","chooseManualSummary":false}]},{"id":"71bd83e6-b5c1-41a6-9c5a-870d3af57d5c","type":"Sectioning","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":"test","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"45c47235-68de-4529-b6ad-d8738b264872","type":"Child","parent":"71bd83e6-b5c1-41a6-9c5a-870d3af57d5c","content":null,"comment":"","summary":"null","chooseManualSummary":false}]},{"id":"40b306b2-1eb7-404e-bd3b-296d94dad008","type":"Sectioning","parent":"4208cb1b-1931-4910-ba11-90b88bbbdd67","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"056841c8-1288-4bce-977a-edac6822f4bf","type":"Child","parent":"40b306b2-1eb7-404e-bd3b-296d94dad008","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"4fe246c7-24b7-4164-823b-f95915fce54c","type":"Sectioning","parent":"40b306b2-1eb7-404e-bd3b-296d94dad008","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"2d8189bf-c881-4157-b124-e7c0b3c74023","type":"Child","parent":"4fe246c7-24b7-4164-823b-f95915fce54c","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"e4bc235e-df3c-4ee6-b0b2-06bed54622e8","type":"Sectioning","parent":"4fe246c7-24b7-4164-823b-f95915fce54c","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"bee79ff9-6b39-4997-8acf-01bcd347828f","type":"Child","parent":"e4bc235e-df3c-4ee6-b0b2-06bed54622e8","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"3e0bd247-c1da-4f19-97db-7a469371b298","type":"Sectioning","parent":"e4bc235e-df3c-4ee6-b0b2-06bed54622e8","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"9cda8d99-4935-41a7-b608-87edf5ffb728","type":"Child","parent":"3e0bd247-c1da-4f19-97db-7a469371b298","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"ac32ac9a-916d-41ed-996e-6e4176626d46","type":"Sectioning","parent":"3e0bd247-c1da-4f19-97db-7a469371b298","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"646a231b-e22c-413c-ba9e-7df8c5ac7da3","type":"Child","parent":"ac32ac9a-916d-41ed-996e-6e4176626d46","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"4b00b63f-bc09-4491-b7e4-5a2161d1e1cc","type":"Sectioning","parent":"ac32ac9a-916d-41ed-996e-6e4176626d46","content":null,"comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"3abdcd3d-3cb2-4358-94c8-aae0efa62354","type":"Child","parent":"4b00b63f-bc09-4491-b7e4-5a2161d1e1cc","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"6a39953f-08c6-439d-bf6d-fb990ed6b61b","type":"Child","parent":"4b00b63f-bc09-4491-b7e4-5a2161d1e1cc","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"2a7d29c0-a5e1-41fe-8284-fd1741fba3b2","type":"Child","parent":"4b00b63f-bc09-4491-b7e4-5a2161d1e1cc","content":null,"comment":"","summary":"null","chooseManualSummary":false}]}]}]}]}]}]}]},{"id":"a4addb83-c8ad-46b6-a80f-4b4a2d770562","type":"Sectioning","parent":"null","content":"fuck","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"781613c2-b962-4267-8a3c-7e67d528705f","type":"Sectioning","parent":"a4addb83-c8ad-46b6-a80f-4b4a2d770562","content":"newChapter","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"4113e1bb-3192-4385-aa13-8b883943dd1b","type":"Child","parent":"781613c2-b962-4267-8a3c-7e67d528705f","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"fc83660b-64c2-4cba-953b-1f151f9020e4","type":"Child","parent":"781613c2-b962-4267-8a3c-7e67d528705f","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"dd1240b8-52cc-4e80-8b24-4dc05b0ef245","type":"Child","parent":"781613c2-b962-4267-8a3c-7e67d528705f","content":null,"comment":"","summary":"null","chooseManualSummary":false}]},{"id":"1a8851b3-f347-4d5f-91e3-88bee4d6d471","type":"Sectioning","parent":"a4addb83-c8ad-46b6-a80f-4b4a2d770562","content":"newChapter2","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"209fe307-1b48-4f63-929e-7be07255ba72","type":"Child","parent":"1a8851b3-f347-4d5f-91e3-88bee4d6d471","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"1e97d05f-6a91-4050-8dcb-5d950d442d3d","type":"Environment","parent":"1a8851b3-f347-4d5f-91e3-88bee4d6d471","content":"algorithm","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"3c9216e0-7773-4705-9da5-d94fc466c27c","type":"Child","parent":"1e97d05f-6a91-4050-8dcb-5d950d442d3d","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"37497f01-325b-4b12-84ca-db4acb82b8d6","type":"Child","parent":"1e97d05f-6a91-4050-8dcb-5d950d442d3d","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"0d9fed73-e412-4205-a1c8-79d4623bd108","type":"Child","parent":"1e97d05f-6a91-4050-8dcb-5d950d442d3d","content":null,"comment":"","summary":"null","chooseManualSummary":false}]},{"id":"ae183e42-f0b0-4a4c-923d-2a823b7e1409","type":"Child","parent":"1a8851b3-f347-4d5f-91e3-88bee4d6d471","content":null,"comment":"","summary":"null","chooseManualSummary":false},{"id":"e53d7be7-432c-4ba3-b159-a788055de556","type":"Environment","parent":"1a8851b3-f347-4d5f-91e3-88bee4d6d471","content":"algorithm","comment":"","summary":"null","chooseManualSummary":false,"children":[{"id":"e88718c4-dc31-43c8-ae7c-2ed5733edb40","type":"Child","parent":"e53d7be7-432c-4ba3-b159-a788055de556","content":null,"comment":"","summary":"null","chooseManualSummary":false}]}]}]}]};
 
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

  /**
   * Returns the base url of the backend
   * 
   * @returns the base url of the backend
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }



  /**
   * Loads data structure that is required for tree view
   * 
   * @returns Array of Objects that represent the tree structure for tree view
   */
  public LoadTree(): Observable<Array<Object>> {
    return this.http
      .get<Array<Object>>(`${this.baseUrl}/LoadTreeData`)
      .pipe(catchError(this.handleError))
  }

  /**
   * Loads json data needed to build composite data structure
   * 
   * @returns Array of Objects that represent the composite data structure
   */
  public LoadFullData(): Observable<Array<Object>> {
   // return of (this.fullData); 


    
    
    return this.http
      .get<Array<Object>>(`${this.baseUrl}/LoadFullData`)
      .pipe(catchError(this.handleError)); 
  } 

  /**
   * Asks the backend if there were any external changes to the files / git repository
   * 
   * @returns true if the backend has updates, false if not
   */
  public CheckForUpdates(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/CheckForUpdates`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sends a request to the backend to push the current data to the git repository / save to folder
   * 
   * @returns no specific return value expected
   */
  public Export(): Observable<any> {
    let exportData: Object = {
      exportComment: this.settings.exportComment,
      exportSummary: this.settings.exportSummary
    };
    console.log(exportData);
    
    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { Export: exportData })
  }


  /**
   * Moves an element in the tree view
   * 
   * @param e Element to be moved
   * @param p New Parent
   * @param pc Previous Child in children list or null if it is the first element
   * @returns Array of Objects that represent the tree structure for tree view
   */
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

  /**
   * Moves an element in the editor view
   * 
   * @param e Element to be moved
   * @param p  New Parent
   * @param pc Previous Child in children list or null if it is the first element
   * @returns Array of Objects that represent the composite data structure
   */
  public MoveElementEditor(
    e: Element,
    p: Parent,
    pc: Element | null
  ): Observable<Object> {
    let moveData: Object = {
      element: e.getId(),
      newParent: p.getId(),
      previousElement: (pc) ? pc.getId() : null,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, {
        MoveElementEditor: moveData,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits the summary of an element
   * 
   * @param e Element to be edited
   * @param s New Summary
   * @returns Array of Objects that represent the composite data structure
   */
  public EditSummary(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      summary: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditSummary: editData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits the comment of an element
   * 
   * @param e Element to be edited
   * @param s New Comment
   * @returns Array of Objects that represent the composite data structure
   */
  public EditComment(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      comment: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditComment: editData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits the content of an element
   * 
   * @param e Element to be edited
   * @param s New Content
   * @returns Array of Objects that represent the composite data structure
   */
  public EditContent(e: Element, s: string): Observable<Object> {
    let editData: Object = {
      element: e.getId(),
      content: s,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { EditContent: editData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes an element either with or without its children
   * 
   * @param e Element to be deleted
   * @returns Array of Objects that represent the composite data structure
   */
  public DeleteElement(e: Element): Observable<Object> {
    let delData: Object = {
      element: e.getId(),
      cascading: this.settings.deleteCascading,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { DeleteElement: delData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds an element to a parent
   */
  public AddElement(content: string, parent: Element, previousElement: Element): Observable<Object> {
    let addData: Object = {
      content: content,
      parent: parent.getId(),
      previousChild: previousElement.getId()
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { AddElement: addData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Imports data from a folder
   * 
   * @param destination Path to the folder
   * @returns Array of Objects that represent the composite data structure
   */
  public LoadFromFolder(destination: string): Observable<Object> {
    let folderData: Object = {
      path: destination,
    };

    return this.http
      .post<Array<Object>>(`${this.baseUrl}/api`, { LoadFromFolder: folderData })
      .pipe(catchError(this.handleError));
  }
  /**
   * Imports data from a git repository
   * 
   * @param url URL of the repository
   * @param user username to authenticate to the repository
   * @param pass password to authenticate to the repository
   * @param path path where repo will be cloned to
   * @returns 
   */
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

  /**
   * Starts polling the backend for updates
   */
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

  /**
   * Stops polling the backend for updates
   */
  public stopPollingData(): void {
    // Emitting a value from stopPolling$ will cause the interval Observable to complete.
    this.stopPolling$.next();
    // Clear the stopPolling$ subject to ensure no leftover values
    this.stopPolling$.complete();
    // Recreate the stopPolling$ subject for future use
    this.stopPolling$ = new Subject();
  }

  /**
   * Helper function to deal with errors
   * 
   * @param error object that contains the error message
   * @returns observable with a user-facing error message
   */
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
      let failMessage = (error.error.failureMessage) ? error.error.failureMessage : error.error.error;
      errorMessage = `Backend returned code ${error.status}, body was: ${failMessage}`;
      console.log(error);
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
