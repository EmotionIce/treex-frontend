import { Component, Input } from '@angular/core';
import { Element } from '../models/element';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class LayerElementComponent {
  @Input() element!: Element;
  
  moveElementEditor() {
    
  }

  deleteElement() {
    
  }

  onBackToParentClick() {
    
  }

  onExtendChild() {
    
  }
}