import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorViewComponent } from './editor-view.component';

import { HeaderComponent } from '../header/header.component';
import { NavigationPartComponent } from '../navigation-part/navigation-part.component';
import { EditorPartComponent } from '../editor-part/editor-part.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { MatIconModule } from '@angular/material/icon';

describe('EditorViewComponent', () => {
  let component: EditorViewComponent;
  let fixture: ComponentFixture<EditorViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditorViewComponent,
        HeaderComponent,
        NavigationPartComponent,
        EditorPartComponent,
        ErrorPopupComponent,
      ],
      imports: [HttpClientModule, MatIconModule],
    });
    fixture = TestBed.createComponent(EditorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
