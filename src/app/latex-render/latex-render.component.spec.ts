import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexRenderComponent } from './latex-render.component';

describe('LatexRenderComponent', () => {
  let component: LatexRenderComponent;
  let fixture: ComponentFixture<LatexRenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LatexRenderComponent]
    });
    fixture = TestBed.createComponent(LatexRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
