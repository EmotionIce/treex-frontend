import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPartComponent } from './editor-part.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

describe('EditorPartComponent', () => {
  let component: EditorPartComponent;
  let fixture: ComponentFixture<EditorPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorPartComponent],
      imports: [HttpClientModule, MatIconModule],
    });
    fixture = TestBed.createComponent(EditorPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
