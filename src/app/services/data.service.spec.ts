import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { take, skip } from 'rxjs/operators';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update activeElement when changeActiveElement is called', (done: DoneFn) => {
    service.currentActiveElementID.pipe(skip(1), take(1)).subscribe((value) => {
      expect(value).toEqual('test');
      done();
    });

    service.changeActiveElement('test');
  });

  it('should increment changeNotifier when notifyChange is called', (done: DoneFn) => {
    service.currentChange.pipe(skip(1), take(1)).subscribe((value) => {
      expect(value).toEqual(1);
      done();
    });

    service.notifyChange();
  });
});
