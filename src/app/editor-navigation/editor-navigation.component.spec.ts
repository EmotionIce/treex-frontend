import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNavigationComponent } from './editor-navigation.component';

describe('EditorNavigationComponent', () => {
  let component: EditorNavigationComponent;
  let fixture: ComponentFixture<EditorNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorNavigationComponent]
    });
    fixture = TestBed.createComponent(EditorNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
