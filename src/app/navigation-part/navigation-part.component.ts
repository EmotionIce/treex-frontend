import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Root } from '../models/root';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule, CdkDragStart, CdkDragEnd, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';


export class ConcreteElement extends Element {
  
}

@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss']
})

export class NavigationPartComponent implements OnInit {
 
  @Input() parentElementID: string | null = null;
  @Output() navParentElementIDChange = new EventEmitter<string | null>();

  hoveredElementID: string | null = null;           //the element that is highlighted. need it to highlight its corresponding children
  displayedNavigationElements: Element[] = []; // the elements from root
  rootInstance: Root;
  parentElement: Element | null = null; // this element gives back the displayedNavigationElements using root.getElementsOfLayer
  navigationParentElementID: string | null = null; //the ID of the parentElement
   layerElements: LayerElement[] = []; //the list of layerElements that are to be shown
   hoveredNavElementID: string | null = null;
   isDropAreaHovered = false;

   

  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }
 
  
  
  ngOnInit() { 
    this.dataService.currentNavigationElements.subscribe(newNavigationElements => { // responsible for changing the displayed Elements
      this.updateNavigation();                                                                              // will happen e.g. when the user presses ExtendChild Button
 
    }) 

    this.dataService.currentChange.subscribe(change => { //updates the currently shown element
      this.updateNavigation();             //happens when elements are changed
      
    });   
    this.updateNavigation();
  
    
  }

  updateNavigation(){
    this.navigationParentElementID = this.dataService.getNavigationElement();
    if (this.navigationParentElementID.length !== 0) {
      this.parentElement = this.rootInstance.searchByID(this.navigationParentElementID);
      if(this.parentElement) {
      this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(this.parentElement);
      this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
      

    }
    }
    


  }


  onNavElementHover(elementID: string | null) { //gives the hovered Element to to editorpart so it can highlight its children
    this.hoveredNavElementID = elementID;
    console.log("working");
    

    if (elementID) {
      this.navParentElementIDChange.emit(this.hoveredNavElementID);
    } else {
      this.navParentElementIDChange.emit(null);
    }
  }



  getFirstFourtyLetters(content: string): string { //takes the first 40 letters of the content to display them
    if (content) {
      return content.slice(0, 40);
    }
    return 'empty content';
  }


  highlightElement(layerElement: LayerElement): boolean { // checks which element has the same ID as the element that is to be highlighted
    if (this.parentElementID) {
      console.log("es wird gehovert");
      //this.onNavElementHover(layerElement.element.getId());
    const element = this.rootInstance.searchByID(this.parentElementID);
      if (element instanceof Element) {
        const parentElement = element.getParent();

        if (parentElement instanceof Element) {
          console.log("parentElement is nicht null");
          const highlightParent = parentElement.getId();

          return highlightParent === layerElement.element.getId(); //so the parentElement is highlighted when the user hovers elements in editorpart
          
        }
      }
    
  } return false;
}


onDragEnter(): void {
  this.isDropAreaHovered = true;
}

onDragExit(): void {
  this.isDropAreaHovered = false;
}


onDrop(event: CdkDragDrop<any[]>) {
  const dropIndex = event.currentIndex;
  console.log(`Element was dropped at index: ${dropIndex}`);
}
trackByFn(index: number, item: LayerElement): string {
  return item.element.getId(); // Use a unique identifier here
}

/*
onDrop(layerElementId: string): void {
 
  } */
  onDragEnded(event: CdkDragDrop<any>) {
    if (event.previousIndex !== event.currentIndex) {
      console.log(`Element dragged from index ${event.previousIndex} to index ${event.currentIndex}`);
      // Handle the reordering or insertion logic here
    }
  }
  
}

