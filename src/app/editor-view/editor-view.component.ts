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
    

      // Create the test elements here
      /*const element1 = new ConcreteElement('id1', 'Content 1', 'Comment 1', 'Summary 1');
      const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
      const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3'); */

    
  
      // Set displayedEditorElements to the test elements
      
  
    this.displayedEditorElements = this.rootInstance.getChildren();
    if (this.displayedEditorElements.length <= 0) { // this can only happen when something with the service is broken
      console.log('Had to resort to predefined elements, editoview did somehow not get the root elements')

    const element1 = new ConcreteElement('id1', 'Content 1Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tiere modifiziert. Die Nasenlöcher liegen auf dem Oberschnabel ziemlich weit vorn; dies ermöglicht es dem Schnabeltier, in weitgehend untergetauchtem Zustand ', 'Kommentar: Schnabeltier sind die besten, 10 out of 10, toller Service, gerne wieder', 'Summary 1 Das Schnabeltier (Ornithorhynchus anatinus, englisch platypus) ist ein eierlegendes Säugetier aus Australien. Es ist die einzige lebende Art der Familie der Schnabeltiere (Ornithorhynchidae). Zusammen mit den vier Arten der Ameisenigel bildet es das Taxon der Kloakentiere (Monotremata), die sich stark von allen anderen Säugetieren unterscheiden.');
    const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
    const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');
    this.displayedEditorElements = [element1, element2, element3]

    
    console.log('editorview just put test inputs in elements', this.displayedEditorElements)
      

    }

    
    this.dataService.changeEditorElements(this.displayedEditorElements);
    console.log('editorview just used dataService to pass editorElements', this.displayedEditorElements)


    
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

 
 

  updateEditorElements(parentElement: Element) {
    this.displayedEditorElements = this.rootInstance.getElementsOfLayer(parentElement); // this line will possibly go, should the service not work
    this.elementIDForEditor
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
    if (parentElement instanceof Parent) {
      this.elementIDForEditor = parentElement.getId();

    }
    //TODO give the elementIDForEditor to the service
    this.updateEditorElements(parentElement as Element);
    
    const grandparentElement = this.parentElement ? this.parentElement.getParent() : this.rootInstance;
    if (grandparentElement instanceof Parent) {
      this.elementIDForNaviagtion = grandparentElement.getId();
    }
    this.updateNavElement(grandparentElement as Element);
    //TODO send the updated lists respectively numbers to editorpart and navigationpart using the service.
    this.dataService.changeEditorElements(this.displayedEditorElements);
    this.dataService.changeNavigationElements(this.displayedNavElements);
    //this.dataService.changeEditorParent.(this.elementIDForEditor)
    //this.dataService.changeEd
  }
}
