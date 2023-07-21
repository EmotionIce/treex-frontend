import { Component, Input, OnInit} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { EditorViewComponent } from '../editor-view/editor-view.component';


@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {
  displayedEditorElements: Element[] = [];
  layerElements: LayerElement[] = [];
  hoveredElementID: string | null = null; /* the element that is highlighted. need it to highlight its corresponding parent */
//TODO: `give the parent of the ElementID to the navigationpart to display it there




  onElementHover(elementID: string | null) {
    this.hoveredElementID = elementID;
  }

  constructor(private editorView: EditorViewComponent) {}

  ngOnInit() {
    this.displayedEditorElements = this.editorView.displayedEditorElements;
    this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element));
  }

  
}

