import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPartComponent } from './editor-part.component';
import { HttpClientModule } from '@angular/common/http';

describe('EditorPartComponent', () => {
  let component: EditorPartComponent;
  let fixture: ComponentFixture<EditorPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorPartComponent],
      imports: [HttpClientModule],
    });
    fixture = TestBed.createComponent(EditorPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
