import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationPartComponent } from './navigation-part.component';

describe('NavigationPartComponent', () => {
  let component: NavigationPartComponent;
  let fixture: ComponentFixture<NavigationPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationPartComponent]
    });
    fixture = TestBed.createComponent(NavigationPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
