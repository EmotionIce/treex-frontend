import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root' //so every other dependencies can access this service
})
export class DataExchangeBackendService {

  private interactionUrl = 'http://localhost:420/api'; //dunno what actual url will be
  constructor(private http: HttpClient) { }

moveElement(element: number, newParent: number) { //actually 2 strings?
  const url = this.interactionUrl + '/move-element';
  let moveElementData = { element, newParent };

  return this.http.post(url, moveElementData);
  }

editSummary(element: number, summary: string) {
  const url = this.interactionUrl + '/editSummary';
  let editSummaryData = { element, summary}

  return this.http.post(url, editSummaryData);
 } 
  
editComment(element: number, comment: string) {
  const  url = this.interactionUrl + 'editComment';
  let editCommentData = {element, comment};

  return this.http.post(url, editCommentData);
}

editContent(element: number, content: string) {
  const  url = this.interactionUrl + 'editContent';
  let editContentData = {element, content};


  return this.http.post(url, editContentData);
}

loadFromFolder(folderDestination: string) {
  const url = this.interactionUrl + '/load-from-folder';
  const loadFromFolderData = { folderDestination };

  return this.http.post(url, loadFromFolderData);

}
loadFromGit(giturl: string, username: string, password: string) {
  const data = { giturl, username, password };
  const url = this.interactionUrl + '/load-from-git';

  return this.http.post(url, data);
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