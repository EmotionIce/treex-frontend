import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Component responsible for handling the importing of LaTeX documents.
 * Provides options for importing documents from a local folder or a git repository.
 */
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
  isLoading: boolean = false;

  /**
   * @param {BackendService} backendService - Service for interacting with the backend
   * @param {JsonToModelConverterService} converter - Service to convert JSON to internal model
   * @param {DataService} dataService - Service for managing shared data across components
   * @param {Router} router - Angular router for navigation
   */
  constructor(
    private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService,
    private router: Router
  ) {}

  /**
   * Initializes the component by retrieving stored paths and URLs from local storage.
   */
  ngOnInit() {
    this.folderPath = localStorage.getItem('folderPath') || '';
    this.gitUrl = localStorage.getItem('gitUrl') || '';
    this.gitUsername = localStorage.getItem('gitUsername') || '';
    this.gitPath = localStorage.getItem('gitPath') || '';
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Saves the current paths and URLs to local storage.
   */
  saveToLocalStorage() {
    localStorage.setItem('folderPath', this.folderPath);
    localStorage.setItem('gitUrl', this.gitUrl);
    localStorage.setItem('gitUsername', this.gitUsername);
    localStorage.setItem('gitPath', this.gitPath);
  }

  /**
   * Loads the LaTeX document from a folder path and initiates conversion.
   */
  loadFromFolder() {
    this.isLoading = true;
    this.saveToLocalStorage();

    let backendResponse = this.backendService.LoadFromFolder(this.folderPath);
    let converted: Observable<boolean> =
      this.converter.convert(backendResponse);

    converted.subscribe(
      (data) => {
        this.isLoading = false; // stop the spinner
        if (!data) return;
        this.startImpuls();
        this.backendService.startPollingData();
      },
      (error) => {
        this.isLoading = false; // stop the spinner if there's an error
        console.error('Error loading from folder:', error);
      }
    );
  }

  /**
   * Loads the LaTeX document from a git repository and initiates conversion.
   */
  loadFromGit() {
    this.isLoading = true;
    this.saveToLocalStorage();

    let backendResponse: Observable<Object> = this.backendService.LoadFromGit(
      this.gitUrl,
      this.gitUsername,
      this.gitPassword,
      this.gitPath
    );
    let converted: Observable<boolean> =
      this.converter.convert(backendResponse);

    converted.subscribe(
      (data) => {
        this.isLoading = false; // stop the spinner
        if (!data) return;
        this.startImpuls();
        this.backendService.startPollingData();
      },
      (error) => {
        this.isLoading = false; // stop the spinner if there's an error
        console.error('Error loading from git:', error);
      }
    );
  }

  /**
   * Resets data service, notifies change, sets import status, and navigates to editor view.
   * @private
   */
  private startImpuls() {
    this.dataService.reset();
    this.dataService.notifyChange();
    this.dataService.setDataImportStatus(true);
    this.router.navigate(['/Editor']);
  }
}
