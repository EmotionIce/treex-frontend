import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorLayerComponent } from './editor-layer.component';

describe('EditorLayerComponent', () => {
  let component: EditorLayerComponent;
  let fixture: ComponentFixture<EditorLayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorLayerComponent]
    });
    fixture = TestBed.createComponent(EditorLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
