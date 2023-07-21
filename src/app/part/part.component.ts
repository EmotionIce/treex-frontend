/* import { Component, Input } from '@angular/core';
import { Element } from '../models/element';
import { LayerElementComponent } from '../layer-element/layer-element.component';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export abstract class Part {
  @Input() elements: Element[] = [];

  createLayerElements(): LayerElementComponent[] {
    return this.elements.map((element) => new LayerElementComponent(element));
  }
} */