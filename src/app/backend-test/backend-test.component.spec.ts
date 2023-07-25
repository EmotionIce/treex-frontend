import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendTestComponent } from './backend-test.component';

describe('BackendTestComponent', () => {
  let component: BackendTestComponent;
  let fixture: ComponentFixture<BackendTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackendTestComponent]
    });
    fixture = TestBed.createComponent(BackendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
