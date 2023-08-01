import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Root } from '../models/root';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';


export class ConcreteElement extends Element {
  
}

@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss']
})

export class NavigationPartComponent implements OnInit {
 
  @Input() parentElementID: string | null = null;
  displayedNavigationElements: Element[] = []; // the elements from root
  rootInstance: Root;
  parentElement: Element | null = null; // this element gives back the displayedNavigationElements using root.getElementsOfLayer
  navigationParentElementID: string | null = null; //the ID of the parentElement
   layerElements: LayerElement[] = []; //the list of layerElements that are to be shown





  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }
 
  
  
  ngOnInit() { 
    this.dataService.currentNavigationElements.subscribe(newNavigationElements => { // responsible for changing the displayed Elements
      console.log("change in navigationpart elements", newNavigationElements)       // will happen e.g. when the user presses ExtendChild Button
      this.navigationParentElementID = newNavigationElements;
      this.parentElement = this.rootInstance.searchByID(this.navigationParentElementID);
      if (this.parentElement) {
      this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(this.parentElement);
      }
      
      
      if (this.displayedNavigationElements.length > 0) {
        this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
  
        
      }
    }) 

    this.dataService.currentChange.subscribe(change => { //updates the currently shown element
      if (this.parentElement) {                          //happens when elements are changed
      
        this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(this.parentElement);
        if (this.displayedNavigationElements.length > 0) {
          this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
        }
        }


    }); 
    
    
    
  }
  getFirstFourtyLetters(content: string): string { //takes the first 40 letters of the content to display them
    return content.slice(0, 40);
  }
  highlightElement(layerElement: LayerElement): boolean { // checks which element has the same ID as the element that is to be highlighted
    return this.parentElementID === layerElement.element.getId(); //so the parentElement is highlighted when the user hovers elements in editorpart
    

  }
}


