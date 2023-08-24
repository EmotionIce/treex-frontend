import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewComponent } from './tree-view.component';
import { HeaderComponent } from '../header/header.component';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { SummaryComponent } from '../summary/summary.component';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreeViewComponent,
        HeaderComponent,
        ErrorPopupComponent,
        SummaryComponent,
      ],
      imports: [HttpClientModule],
    });
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
