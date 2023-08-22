import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  folderPath: string = '';
  gitUrl: string = '';
  gitUsername: string = '';
  gitPassword: string = '';
  gitPath: string = '';
  hidePassword: boolean = true;

  constructor(private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    this.folderPath = localStorage.getItem('folderPath') || '';
    this.gitUrl = localStorage.getItem('gitUrl') || '';
    this.gitUsername = localStorage.getItem('gitUsername') || '';
    this.gitPath = localStorage.getItem('gitPath') || '';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  saveToLocalStorage() {
    localStorage.setItem('folderPath', this.folderPath);
    localStorage.setItem('gitUrl', this.gitUrl);
    localStorage.setItem('gitUsername', this.gitUsername);
    localStorage.setItem('gitPath', this.gitPath);
  }

  loadFromFolder() {
    this.saveToLocalStorage();

    let backendResponse = this.backendService.LoadFromFolder(this.folderPath);
    let converted: Observable<boolean> = this.converter.convert(backendResponse);

    converted.subscribe((data) => {
      if (!data) return;
      this.startImpuls();
    });
  }

  loadFromGit() {
    this.saveToLocalStorage();

    let backendResponse: Observable<Object> = this.backendService
      .LoadFromGit(
        this.gitUrl,
        this.gitUsername,
        this.gitPassword,
        this.gitPath
      );
    let converted: Observable<boolean> = this.converter.convert(backendResponse);

    converted.subscribe((data) => {
      if (!data) return;
      this.startImpuls();
      this.backendService.startPollingData();
    });
  }

  private startImpuls() {
    this.dataService.reset();
    this.dataService.notifyChange();
    this.dataService.setDataImportStatus(true);
    this.router.navigate(['/Editor']);
  }
}
