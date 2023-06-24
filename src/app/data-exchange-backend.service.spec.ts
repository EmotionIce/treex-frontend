import { TestBed } from '@angular/core/testing';

import { DataExchangeBackendService } from './data-exchange-backend.service';

describe('DataExchangeBackendService', () => {
  let service: DataExchangeBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExchangeBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
