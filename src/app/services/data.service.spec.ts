import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { take } from 'rxjs/operators';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit new data after changeData is called', (done) => {
    const testData = 'Test Data';

    service.changeData(testData);

    service.currentData.pipe(take(1)).subscribe((data) => {
      expect(data).toBe(testData);
      done();
    });
  });

  it('should not emit new data if changeData is not called', (done) => {
    const initialData = '';

    service.currentData.pipe(take(1)).subscribe((data) => {
      expect(data).toBe(initialData);
      done();
    });
  });
});
