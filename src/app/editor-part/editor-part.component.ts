import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';


@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {
  @Input() displayedEditorElements: Element[] = [];
  layerElements: LayerElement[] = [];
  hoveredElementID: string | null = null; /* the element that is highlighted. need it to highlight its corresponding parent */
//TODO: `give the parent of the ElementID to the navigationpart to display it there


@Output() hoveredElement: EventEmitter<string | null> = new EventEmitter<string | null>();

  onElementHover(elementID: string | null) {
    this.hoveredElementID = elementID;
    this.hoveredElement.emit(this.hoveredElementID);
  }

  constructor() {}

  ngOnInit() {
    this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element));
  }
  showSummary() {
   // const summary = layerElement.element.getSummary();
  
    // TODO: Display the summary in a separate text-editor
    //console.log('Summary:', summary);
  }

  
}

