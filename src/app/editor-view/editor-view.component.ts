import { Component } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';



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
  hoveredElementID: string | null = null;
  currentElementID: string | null = null;
  currentElement: Element | null = null;



  constructor(private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }


  ngOnInit() {
    this.displayedEditorElements = this.rootInstance.getChildren();
    this.dataService.currentChange.subscribe(change => {

      this.updateEditor();
   });
   this.dataService.currentActiveElementID.subscribe(id => {
    // hier kannst du machen, was immer du mit der neuen ID machen möchtest
    this.currentElementID = id;
    this.currentElement = this.rootInstance.searchByID(this.currentElementID);
 });

    

  }
 

  updateEditorElements(parentElement: Element) {
    this.displayedEditorElements = this.rootInstance.getElementsOfLayer(parentElement);
  }
  updateNavElement(parentElement: Element) {
    this.displayedNavElements = this.rootInstance.getElementsOfLayer(parentElement);
  }

  onElementHover(elementID: string | null) {
    this.hoveredElementID = elementID;
  }

  isElementHovered(element: Element): boolean {
    return this.hoveredElementID === element.getId();
  }
  updateEditor() {

    const parentElement = this.currentElement ? this.currentElement.getParent() : this.rootInstance;
    this.updateEditorElements(parentElement as Element);
    const grandparentElement = this.parentElement ? this.parentElement.getParent() : this.rootInstance;
    this.updateNavElement(grandparentElement as Element);
  }
}
