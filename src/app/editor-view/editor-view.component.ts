import { Component, OnInit } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Parent } from '../models/parent';

export class ConcreteElement extends Element {
  
}




@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit{
 
  rootInstance: Root;
  elementIDForEditor: string | null = '';         // the ID the editor takes to show the correct elements
  elementIDForNaviagtion: string | null = '';     //the ID the navigation takes to show the correct elements
  parentElement: Element | null = null;           //the element that is given to the navigationpart to highlight the parent of the currently
                                                  //highlighted element in the editor
  hoveredParentElementID: string | null = null;   //the id of that parentElement
  currentElement: Element | null = null;          //the element from which all the other lists of elements are decided
  currentElementID: string | null = null;         //the ID of that element
  
  
  



  constructor(private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }


  ngOnInit() {
    

    
   


   this.dataService.currentActiveElementID.subscribe(id => { //if the user wants to see different elements e.g. the children of one
         
        this.currentElementID = id;
       
        this.currentElement = this.rootInstance.searchByID(this.currentElementID);
        this.updateEditor();

    });
  }

  onHoveredParentElementIDChange(parentElementID: string | null) { //to pass the hovered Element from editorpart to navigationpart
   
    this.hoveredParentElementID = parentElementID;
    
  }

  
  updateEditor() { // gives editorpart and navigationpart the new currentElement so they show it
    
    const parentElement = this.currentElement ? this.currentElement.getParent() : this.rootInstance;
    if (parentElement instanceof Parent) {
      this.elementIDForNaviagtion = parentElement.getId();

    }
    this.dataService.changeEditorElements(this.currentElementID);
    this.dataService.changeNavigationElements(this.elementIDForNaviagtion);
    
  }
}
