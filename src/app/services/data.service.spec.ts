import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { Child } from '../models/child';

describe('DataService', () => {
  let service: DataService;
  let mockParent: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);

    // Initializing the mockElement with some default properties. You may need to modify this as per your 'Child' model.
    mockParent = "ASD";
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change active element', (done: DoneFn) => {
    service.changeActiveElement('test');
    service.currentActiveElementID.subscribe((value) => {
      expect(value).toBe('test');
      done();
    });
  });

  it('should notify change', (done: DoneFn) => {
    service.notifyChange();
    service.currentChange.subscribe((value) => {
      expect(value).toBe(1);
      done();
    });
  });

  it('should change navigation elements', (done: DoneFn) => {
    service.changeNavigationElements(mockParent);
    service.currentNavigationElements.subscribe((value) => {
      expect(value).toEqual(mockParent);
      done();
    });
  });

  it('should change editor elements', (done: DoneFn) => {
    service.changeEditorElements(mockParent);
    service.currentEditorElements.subscribe((value) => {
      expect(value).toEqual(mockParent);
      done();
    });
  });
});
