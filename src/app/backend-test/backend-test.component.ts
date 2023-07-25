import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-backend-test',
  templateUrl: './backend-test.component.html',
  styleUrls: ['./backend-test.component.scss']
})
export class BackendTestComponent implements OnInit {
  endpoints: { name: string, parameters: string[], method: (...args: any[]) => Observable<any> }[] = [];
  parameterValues: { [key: string]: { [key: string]: any } } = {};
  // store responses
  responses: { [key: string]: any } = {};

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    // Define your endpoints here
    this.endpoints = [
      { name: 'GitPush', parameters: [], method: this.backendService.GitPush.bind(this.backendService) },
      { name: 'LoadTree', parameters: [], method: this.backendService.LoadTree.bind(this.backendService) },
      { name: 'LoadFullData', parameters: [], method: this.backendService.LoadFullData.bind(this.backendService) },
      { name: 'CheckForUpdates', parameters: [], method: this.backendService.CheckForUpdates.bind(this.backendService) },
      { name: 'MoveElementTree', parameters: ['e', 'p', 'pc'], method: this.backendService.MoveElementTree.bind(this.backendService) },
      { name: 'MoveElementEditor', parameters: ['e', 'p', 'pc'], method: this.backendService.MoveElementEditor.bind(this.backendService) },
      { name: 'EditSummary', parameters: ['e', 's'], method: this.backendService.EditSummary.bind(this.backendService) },
      { name: 'EditComment', parameters: ['e', 's'], method: this.backendService.EditComment.bind(this.backendService) },
      { name: 'EditContent', parameters: ['e', 's'], method: this.backendService.EditContent.bind(this.backendService) },
      { name: 'DeleteElement', parameters: ['e', 's'], method: this.backendService.DeleteElement.bind(this.backendService) },
      { name: 'LoadFromFolder', parameters: ['destination'], method: this.backendService.LoadFromFolder.bind(this.backendService) },
      { name: 'LoadFromGit', parameters: ['url', 'user', 'pass', 'path'], method: this.backendService.LoadFromGit.bind(this.backendService) }
    ];
    

    // Initialize parameterValues
    this.endpoints.forEach(endpoint => {
      this.parameterValues[endpoint.name] = {};
      endpoint.parameters.forEach(param => this.parameterValues[endpoint.name][param] = null);
    });
  }

  execute(endpoint: { name: string, parameters: string[], method: (...args: any[]) => Observable<any> }, parameterValues: { [key: string]: any }) {
    const args = endpoint.parameters.map(param => parameterValues[param]);
    endpoint.method(...args).subscribe(
      res => this.responses[endpoint.name] = res,
      err => this.responses[endpoint.name] = `Error: ${err}`
    );
  }
}
