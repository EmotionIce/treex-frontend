import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BackendService } from './backend.service';
import { SettingsService } from './settings';
import { ErrorPopupService } from './error-popup.service';
import { DataService } from './data.service';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: any;
  let errorPopupServiceMock: any;
  let dataServiceMock: any;

  beforeEach(() => {
    settingsServiceMock = jasmine.createSpyObj('SettingsService', [
      'getSettings',
    ]);
    errorPopupServiceMock = jasmine.createSpyObj('ErrorPopupService', [
      'setErrorMessage',
    ]);
    dataServiceMock = jasmine.createSpyObj('DataService', ['notifyChange']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BackendService,
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: ErrorPopupService, useValue: errorPopupServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
    });

    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request when GitPush() is called', () => {
    service.GitPush().subscribe();
    const req = httpMock.expectOne('http://localhost:8080/gitPush');
    expect(req.request.method).toBe('GET');
  });

  // Add more tests for the other methods here...
});
