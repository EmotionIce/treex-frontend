import { Component } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';


@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent {
  rootInstance: Root;
  displayedEditorElements: Element[] = [];
  displayedNavElements: Element[] = [];
  parentElement: Element | null = null;

  constructor() {
    this.rootInstance = Root.createRoot();
  }

  ngOnInit() {
    this.displayedEditorElements = this.rootInstance.getChildren();
  }

  updateEditorElements(parentElement: Element) {
    this.displayedEditorElements = this.rootInstance.getElementsOfLayer(parentElement);
  }
  updateNavElement(parentElement: Element) {
    this.displayedNavElements = this.rootInstance.getElementsOfLayer(parentElement);
  }
}