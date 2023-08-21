import {
  Component
} from '@angular/core';
import {
  BackendService
} from '../services/backend.service';
import {
  JsonToModelConverterService
} from '../services/json-to-model-converter.service';
import {
  DataService
} from '../services/data.service';
import {
  Observable
} from 'rxjs';
import {
  Router
} from '@angular/router';

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

  constructor(private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService,
    private router: Router) { }

    /**
     * Loads the data from the given folder path
     */
  loadFromFolder() {
    let backendResponse = this.backendService.LoadFromFolder(this.folderPath);
    let converted: Observable<boolean> = this.converter.convert(backendResponse);

    converted.subscribe((data) => {
      if (!data) return;
      this.startImpuls();
    });
  }
  /**
   * Loads the data from the given git repository
   */
  loadFromGit() {
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
      // Start polling
      this.backendService.startPollingData();
    });
  }

  /**
   * Notifies Components that the data has changed and navigates to Editor
   */
  private startImpuls() {
    this.dataService.reset();
    // Notify the data service that the data has changed
    this.dataService.notifyChange();
    // Set data service to imported
    this.dataService.setDataImportStatus(true);
    // Switch to Editor
    this.router.navigate(['/Editor']);
  }
}
