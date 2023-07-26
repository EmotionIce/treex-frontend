import { TestBed } from '@angular/core/testing';

import { TreeViewSummaryService } from './tree-view-summary.service';

describe('TreeViewSummaryService', () => {
  let service: TreeViewSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeViewSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
