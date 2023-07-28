import { Component, OnInit } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Parent } from '../models/parent';

import { EditorPartComponent } from '../editor-part/editor-part.component';

export class ConcreteElement extends Element {
  
}




@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit{
 
  rootInstance: Root;
  displayedEditorElements: Element[] = [];
  displayedNavElements: Element[] = [];
  parentElement: Element | null = null;
  hoveredElementID: string | null = null;
  hoveredParentElementID: string | null = null;
  currentElementID: string | null = null;
  currentElement: Element | null = null;
  //ids for t editorpart and navigationpart, should the problem with not data transporting service not be resolved
  elementIDForEditor: string | null = '';
  elementIDForNaviagtion: string | null = '';
  //element5 = new ConcreteElement('id5', 'Content 5', 'Comment 5', 'Summary 5');
  



  constructor(private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }


  ngOnInit() {
    console.log('EditorViewComponent: ngOnInit called');
    

      
      
  
    
    

    
   


    
    this.dataService.currentChange.subscribe(change => {

      this.updateEditor();
   });
   this.dataService.currentActiveElementID.subscribe(id => {
    // hier kannst du machen, was immer du mit der neuen ID machen möchtest

    //in theory, the editorview, gets the newcurrentElement, gets its parent and grandparent and updates the Editor using the updateEditor. 
    this.currentElementID = id;
    this.currentElement = this.rootInstance.searchByID(this.currentElementID);
    this.updateEditor();

 });

    

  }

 
 

  

  onHoveredParentElementIDChange(parentElementID: string | null) {
    this.hoveredParentElementID = parentElementID;
  }

  
  updateEditor() {

    const parentElement = this.currentElement ? this.currentElement.getParent() : this.rootInstance;
    if (parentElement instanceof Parent) {
      this.elementIDForEditor = parentElement.getId();

    }
    
    
    
    const grandparentElement = this.parentElement ? this.parentElement.getParent() : this.rootInstance;
    if (grandparentElement instanceof Parent) {
      this.elementIDForNaviagtion = grandparentElement.getId();
    }
    
    
    const editorElementId: string = this.elementIDForEditor ?? '';

  
  const navigationElementId: string = this.elementIDForNaviagtion ?? '';

  
  this.dataService.changeEditorElements(editorElementId);
  this.dataService.changeNavigationElements(navigationElementId);
    
  }
}
