import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorComponent } from './text-editor.component';
import { FormsModule } from '@angular/forms';

describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextEditorComponent],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
