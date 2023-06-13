import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerElementComponent } from './layer-element.component';

describe('LayerElementComponent', () => {
  let component: LayerElementComponent;
  let fixture: ComponentFixture<LayerElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayerElementComponent]
    });
    fixture = TestBed.createComponent(LayerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
