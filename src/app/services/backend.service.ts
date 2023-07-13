import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http'

import {
  Observable,
  throwError
} from 'rxjs';
import {
  catchError
} from 'rxjs/operators';

// import composite structure
import {
  Element
} from '../models/element';
import {
  Parent
} from '../models/parent';

import {
  SettingsService,
  Settings
} from './settings';

@Injectable({
  providedIn: 'root' //so every other dependencies can access this service
})
export class BackendService {

  private baseUrl = 'http://localhost:5000'; //actual url will be 8080 apparently
  private settings: Settings;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.settings = settingsService.getSettings();
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public GitPush(): Observable < any > {
    return this.http.get < Array < Object >> (`${this.baseUrl}/gitPush`);
  }

  public LoadTree(): Observable < Array < Object >> {
    return this.http.get < Array < Object >> (`${this.baseUrl}/loadTree`);
  }

  public MoveElementTree(e: Element, p: Parent, pc: Element): Observable < Array < Object >> {
    let moveData: Object = {
      "element": e.getId(),
      "newParent": p.getId(),
      "previousElement": pc.getId()
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/moveElementTree`, moveData)
      .pipe(
        catchError(this.handleError)
      );

  }

  public MoveElementEditor(e: Element, p: Parent, pc: Element): Observable < Object > {
    let moveData: Object = {
      "element": e.getId(),
      "newParent": p.getId(),
      "previousElement": pc.getId()
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/moveElementEditor`, moveData)
      .pipe(
        catchError(this.handleError)
      );
  }

  public EditSummary(e: Element, s: string): Observable < Object > {
    let editData: Object = {
      "element": e.getId(),
      "summary": s
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/editSummary`, editData)
      .pipe(
        catchError(this.handleError)
      );
  }

  public EditComment(e: Element, s: string): Observable < Object > {
    let editData: Object = {
      "element": e.getId(),
      "comment": s
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/editComment`, editData)
      .pipe(
        catchError(this.handleError)
      );
  }

  public EditContent(e: Element, s: string): Observable < Object > {
    let editData: Object = {
      "element": e.getId(),
      "content": s
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/editContent`, editData)
      .pipe(
        catchError(this.handleError)
      );
  }

  public DeleteElement(e: Element, s: string): Observable < Object > {
    let delData: Object = {
      "element": e.getId(),
      "cascading": this.settings.deleteCascading
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/deleteElement`, delData)
      .pipe(
        catchError(this.handleError)
      );
  }


  public LoadFromFolder(destination: string): Observable < Object > {
    let folderData: Object = {
      "path": destination
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/loadFolder`, folderData)
      .pipe(
        catchError(this.handleError)
      );
  }

  public LoadFromGit(url: string, user: string, pass: string): Observable < Object > {
    let gitData: Object = {
      "url": url,
      "username": user,
      "password": pass
    }

    return this.http.post < Array < Object >> (`${this.baseUrl}/loadGit`, gitData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // helper function to handle backend errors
  private handleError(error: HttpErrorResponse) {
    // TODO: add error popup component and display error method

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  /* calling code for that would look like:
  this.DataExchangeBackendService.moveElement(element, newParent).subscribe(
    response => { let newTree = response.data.newTree
      // Handle  response from the backend
    },
    error => {
      // Handle errors
    }
  );

  this would create an observa
  */

}
