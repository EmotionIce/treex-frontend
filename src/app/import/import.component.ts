import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent {
  folderPath: string = '';
  gitUrl: string = '';
  gitUsername: string = '';
  gitPassword: string = '';
  gitPath: string = '';

  constructor(private backendService: BackendService) {}

  loadFromFolder() {
    this.backendService.LoadFromFolder(this.folderPath).subscribe((data) => {
      console.log(data);

      // Start polling
      this.backendService.startPollingData();
    });
  }

  loadFromGit() {
    this.backendService
      .LoadFromGit(
        this.gitUrl,
        this.gitUsername,
        this.gitPassword,
        this.gitPath
      )
      .subscribe((data) => {
        console.log(data);

        // Start polling
        this.backendService.startPollingData();
      });
  }
}
