import { Component, OnInit } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { EditorPartComponent } from '../editor-part/editor-part.component';

export class ConcreteElement extends Element {
  // If any additional properties are needed, add them here
}



@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit{
  displayedStrings: string[] = ['String 1', 'String 2', 'String 3'];
  rootInstance: Root;
  displayedEditorElements: Element[] = [];
  displayedNavElements: Element[] = [];
  parentElement: Element | null = null;
  hoveredElementID: string | null = null;
  currentElementID: string | null = null;
  currentElement: Element | null = null;
  element5 = new ConcreteElement('id5', 'Content 5', 'Comment 5', 'Summary 5');
  



  constructor(private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }


  ngOnInit() {
    console.log('EditorViewComponent: ngOnInit called');
    

      // Create the test elements here
      /*const element1 = new ConcreteElement('id1', 'Content 1', 'Comment 1', 'Summary 1');
      const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
      const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3'); */

    
  
      // Set displayedEditorElements to the test elements
      
  
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
