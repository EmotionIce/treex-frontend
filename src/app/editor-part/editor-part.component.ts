import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService
 } from '../services/json-to-model-converter.service';
 import { Observable } from 'rxjs';
 import { DataService } from '../services/data.service';
 import { Parent } from '../models/parent';
 import { SettingsService } from '../services/settings';
 import { Root } from '../models/root';
 import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
 import { LatexRenderComponent } from '../latex-render/latex-render.component';
 import { of } from 'rxjs';




 export class ConcreteElement extends Element { //temporary class to test elements
  
}

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {


  settings: any;
  displayedEditorElements: Element[] = [];          //the list of elements that are supposed to be shown
  layerElements: LayerElement[] = [];               //the list of layerElements that are shown
  editorParentElementID: string | null = null;      //the ID of the element that is used for root.getElementsOfLayer(element)
  editorParentElement: Element | null = null;       //the element that is used for root.getElementsOfLayer(element)
  parentElementID: string | null = null;            //the ID of the element that goes to the navigationpart to be highlighted there
  hoveredParentID: string | null = null;            //element that goes to the navigationpart to be highlighted there
  hoveredElementID: string | null = null;           //the element that is highlighted. need it to highlight its corresponding parent
  elementIDToBeEdited: string | null = null;        // the ID of the element that is shown in the text-editor. will be acessed after texteditor
                                                    //is finished to give the backend the correct element
  inEditMode = false;                               //checks whether a text is supposed to be shown in edit mode
  draggedLayerElement: LayerElement | null = null;  //the element that is being dragged

  rootInstance: Root;



  @Output() parentElementIDChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  onElementHover(elementID: string | null) { //gives parentElement of hoveredElement to editorview
    this.hoveredElementID = elementID;
    
    if (elementID) {
      const element = this.rootInstance.searchByID(elementID);
      if (element instanceof Element) {
        const parentElement = element.getParent();
        
        if (parentElement instanceof Element) {
          this.parentElementID = parentElement.getId();
          this.parentElementIDChange.emit(this.parentElementID);
        } 
      }
    }
  }

  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService, private settingsService: SettingsService, private cdr: ChangeDetectorRef ) {

    this.rootInstance = Root.createRoot();


  }
   

  ngOnInit() {

    this.backendService.LoadFullData().subscribe(
      (fullData: Object) => {
        // Once you have the fullData, pass it to the JsonToModelConverterService's convert method
        const converted: Observable<boolean> = this.converter.convert(of(fullData));
  
        converted.subscribe((value: boolean) => {
          if (value) {
            // Conversion successful, do something if needed
          } else {
            // Conversion failed, handle the error if needed
          }
        });
      },
      (error) => {
        // Handle the error if the backend service call fails
        console.error('Error fetching full data:', error);
      }
    );
    this.settings = this.settingsService.getSettings();   
    
   
    
    this.dataService.currentEditorElements.subscribe(newEditorElements => { /*
      console.log("these are the layerElements at the beginning of newEditorElements: ", this.layerElements);
      console.log("and the editorelements list:", this.displayedEditorElements);
      this.layerElements = [];
      
      
      console.log("service gave editorpart new elements", newEditorElements)
      
      this.editorParentElementID = newEditorElements;
      this.editorParentElement = this.rootInstance.searchByID(this.editorParentElementID);
      console.log("editorpart, editorParentELement: ", this.editorParentElement);
      
      if (this.editorParentElement) {
      this.displayedEditorElements = this.rootInstance.getElementsOfLayer(this.editorParentElement);
      console.log("editorpart took elements from the root", this.displayedEditorElements, this.editorParentElement)
      this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
      console.log("now there should be new layerElements which are the children of the clicked parent element", this.layerElements)
      this.cdr.detectChanges();
        
      }

      
        
      */
    }) 
    this.dataService.currentChange.subscribe(change => {

      if (this.editorParentElement) {
        this.displayedEditorElements = this.rootInstance.getElementsOfLayer(this.editorParentElement);
        if (this.displayedEditorElements.length > 0) {
          this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
        }
        }


    });

    this.displayedEditorElements = this.rootInstance.getChildren();
    
    if (this.displayedEditorElements.length <= 0) { //test elements used to test the layerElement boxes
    const element1 = new ConcreteElement('id1', 'Content 1Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tiere modifiziert. Die Nasenlöcher liegen auf dem Oberschnabel ziemlich weit vorn; dies ermöglicht es dem Schnabeltier, in weitgehend untergetauchtem Zustand ', 'Kommentar: Schnabeltier sind die besten, 10 out of 10, toller Service, gerne wieder', 'Summary 1 Das Schnabeltier (Ornithorhynchus anatinus, englisch platypus) ist ein eierlegendes Säugetier aus Australien. Es ist die einzige lebende Art der Familie der Schnabeltiere (Ornithorhynchidae). Zusammen mit den vier Arten der Ameisenigel bildet es das Taxon der Kloakentiere (Monotremata), die sich stark von allen anderen Säugetieren unterscheiden.');
    const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
    const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');
    const element4 = new ConcreteElement('id4', '\\frac{\\pi}{2}', 'Comment 4', 'Summary 4');

    this.displayedEditorElements = [
      element1, element2, element3, element4
      
    ]; } 

    if (this.displayedEditorElements.length > 0) {
      this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService, this.converter, this.dataService));

      
    } 
  }

  onDragStarted(layerElement: LayerElement) { //saves the element that is being dragged
    this.draggedLayerElement = layerElement;

  }

  onDrop(event: any) { //handles the dropping of an element
    const draggedElement = this.draggedLayerElement?.element;
    const draggedParentElement = draggedElement?.getParent();
    const droppedLayerElement: LayerElement = event.item.data;
    if(draggedElement) {
      if (draggedParentElement instanceof Parent) {
      droppedLayerElement.moveElementEditor(draggedElement, draggedParentElement)
      }
    }
    this.draggedLayerElement = null;
  }
  
  

  onDelete(layerElement: LayerElement) { //calles deleteElement in layerElement
    layerElement.deleteElement;

  }

  isParent(element: Element): boolean { //checks if element is type of parent
    return element instanceof Parent;
  }
  showChildren(layerElement: LayerElement) { //calles onExtendChild in layerElement
    layerElement.onExtendChild();
    console.log("the showChildren just was pressed", layerElement);
    if (layerElement.element instanceof Parent) {
      console.log("layerElement is an actual parent", layerElement.element.getChildren());
      this.displayedEditorElements = layerElement.element.getChildren();
      if (this.displayedEditorElements.length > 0) {
        console.log("layerElement old", this.layerElements);
        this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService, this.converter, this.dataService));
        console.log("displayedEditorElements just were changed in the showChildren in editorpart. layerElements new", this.layerElements)
        this.cdr.detectChanges();
  
        
      } 

    } console.log("layerElements when the showChildren button is pressed", this.layerElements)
    

  }
  showParent(layerElement : LayerElement) { //calles onBackToParentClick in layerElement
    layerElement.onBackToParentClick();
    const parent = layerElement.element.getParent() as Element; // Type assertion
    this.displayedEditorElements = this.rootInstance.getElementsOfLayer(parent);
    this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService, this.converter, this.dataService));
    this.cdr.detectChanges();
  
  
    

    
  }


  showContent(layerElement: LayerElement): string { //when the user presses the showContent button it shows the content in an editable window
    layerElement.showContentTextbox = !layerElement.showContentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
        
  
        return layerElementToBeEdited.element.getContent();
      }
    }
    
    return '';
  }


  onContentUpdated(updatedContend: string) { //gives Backend the new content   
  const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
  elementToBeSaved?.contentComponent
  if (elementToBeSaved) {

  
  const backendResponse: Observable<Object> = this.backendService.EditContent(elementToBeSaved.element, updatedContend);

  const converted: Observable<boolean> = this.converter.convert(backendResponse);
  
  converted.subscribe((value: boolean) => {
    if (value) {
      
      this.dataService.notifyChange();
    } 
  });
  }
  }


  showComment(layerElement: LayerElement): string {  //when the user presses the showComment button it shows the comment in an editable window
    layerElement.showCommentTextbox = !layerElement.showCommentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
      
  
        return layerElementToBeEdited.element.getComment();
      }
    }
    
    return 'Error in showcomment';
  }


  onCommentUpdated(updatedComment: string) { //gives backend the new comment
  
    const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
    if (elementToBeSaved) {
    const backendResponse: Observable<Object> = this.backendService.EditComment(elementToBeSaved.element, updatedComment);

    const converted: Observable<boolean> = this.converter.convert(backendResponse);
    
    converted.subscribe((value: boolean) => {
      if (value) {
        
        this.dataService.notifyChange();

        
      } else {
        
      }
    });
  }
}

  

  showSummary(layerElement: LayerElement): string  { //when the user presses the showSummary button it shows the summary in an editable window
    layerElement.showSummaryTextbox = !layerElement.showSummaryTextbox;
    
    
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
        // now i have the LayerElement that matches the hoveredElementID and can acess its Summary

        return layerElementToBeEdited.element.getSummary();

        

      }
    }
    return 'error. either nothing is  being hovered or there is no corresponding element currently shown in the editor'
  }

  onSummaryUpdated(updatedSummary: string) { //gives the backend the new summary
   
      // Call the backend service to update the summary
      const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (elementToBeSaved) {

      
      const backendResponse: Observable<Object> = this.backendService.EditSummary(elementToBeSaved.element, updatedSummary);

      const converted: Observable<boolean> = this.converter.convert(backendResponse);
      
      converted.subscribe((value: boolean) => {
        if (value) {
          
          this.dataService.notifyChange();

        } else {
          
        }
      });
    }
  }
}

