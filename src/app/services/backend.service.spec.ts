import {
  TestBed
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  BackendService
} from './backend.service';

import {
  Root
} from '../models/root';
import {
  Element
} from '../models/element';
import {
  Parent
} from '../models/parent';
import {
  Child
} from '../models/child';
import {
  Environment
} from '../models/environment';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;
  let root: Root;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendService]
    });

    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
    root = Root.createRoot();
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send requests correctly', () => {
    let env = new Environment('1', 'content', 'comment', 'summary', root);
    let child = new Child('2', 'content', 'comment', 'summary', root);

    service.MoveElementEditor(child, env, env).subscribe({
      next: (response: any) => {

        let newTree = response.data.newTree;

        // Handle  response from the backend
      },
      error: (error) => {
        // Handle errors
      }
    });

    const req = httpMock.expectOne(`${service.getBaseUrl()}/moveElementEditor`);
    expect(req.request.method).toBe('POST');
    req.flush({
      data: {
        newTree: {}
      }
    });
  });

  it('should send LoadTree requests correctly', () => {
    service.LoadTree().subscribe({
      next: (response: any) => {
        let tree = response.data.tree;
        // Handle  response from the backend
      },
      error: (error) => {
        // Handle errors
      }
    });

    const req = httpMock.expectOne(`${service.getBaseUrl()}/loadTree`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: {
        tree: {}
      }
    });
  });

  it('should send EditSummary requests correctly', () => {
    let element = new Child('1', 'content', 'comment', 'summary', root);
    let summary = 'new summary';

    service.EditSummary(element, summary).subscribe({
      next: (response: any) => {
        let newSummary = response.data.newSummary;
        // Handle  response from the backend
      },
      error: (error) => {
        // Handle errors
      }
    });

    const req = httpMock.expectOne(`${service.getBaseUrl()}/editSummary`);
    expect(req.request.method).toBe('POST');
    req.flush({
      data: {
        newSummary: summary
      }
    });
  });

  it('should send LoadFromGit requests correctly', () => {
    let url = 'https://github.com/user/repo.git';
    let user = 'username';
    let pass = 'password';
    let path = 'path/to/file';

    service.LoadFromGit(url, user, pass, path).subscribe({
      next: (response: any) => {
        let gitData = response.data.gitData;
        // Handle  response from the backend
      },
      error: (error) => {
        // Handle errors
      }
    });

    const req = httpMock.expectOne(`${service.getBaseUrl()}/loadGit`);
    expect(req.request.method).toBe('POST');
    req.flush({
      data: {
        gitData: {}
      }
    });
  });

});
