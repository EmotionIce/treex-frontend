import { Component, OnInit, Output, EventEmitter} from '@angular/core';
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



 export class ConcreteElement extends Element {
  
}

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {


 

 




  layerElements: LayerElement[] = [];
  displayedEditorElements: Element[] = [];
  editorParentElementID: string | null = null;
  parentElement: Element | null = null;
  hoveredParentID: string | null = null;
  hoveredElementID: string | null = null; /* the element that is highlighted. need it to highlight its corresponding parent */
  elementIDToBeEdited: string | null = null; /* the ID of the element that is shown in the text-editor. will be acessed after texteditor
                                              is finished to give the backend the correct element */
  inEditMode = false;
  draggedLayerElement: LayerElement | null = null;
  //settings: Settings;
  //TODO: `give the parent of the ElementID to the navigationpart to display it there

  deleteElementChildren = false; // the bool that decides whether to also delete all children of an element or not


  rootInstance: Root;



  @Output() hoveredParentElementID: EventEmitter<string | null> = new EventEmitter<string | null>();

  onElementHover(elementID: string | null) {
    this.hoveredElementID = elementID;
    if (elementID) {
      const element = this.rootInstance.searchByID(elementID);
      if (element instanceof Element) {
        const parentElement = element.getParent();
        
        if (parentElement instanceof Element) {
          const parentElementID = parentElement.getId();
          
        } 
      }
    }
  }

  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService) {

    this.rootInstance = Root.createRoot();


  }
   

  ngOnInit() {
    this.displayedEditorElements = this.rootInstance.getChildren();
    

  


   
   
    
    this.dataService.currentEditorElements.subscribe(newEditorElements => {
      console.log('editorpart, how displayedEditorElements look like before service did anything', this.displayedEditorElements)
      
      this.editorParentElementID = newEditorElements;
      this.parentElement = this.rootInstance.searchByID(this.editorParentElementID);
      if (this.parentElement) {
      this.displayedEditorElements = this.rootInstance.getElementsOfLayer(this.parentElement);
      }
      
      console.log('getting the elements throught the service in the editorpart', this.displayedEditorElements)
      
      
      
      if (this.displayedEditorElements.length > 0) {
        this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
      }
    })
    this.dataService.currentChange.subscribe(change => {

      if (this.parentElement) {
        this.displayedEditorElements = this.rootInstance.getElementsOfLayer(this.parentElement);
        if (this.displayedEditorElements.length > 0) {
          this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
        }
        }


    });
    
   
    
    // Sample data for testing. currently on "if" so i can show root Elements aswell."
    if (this.displayedEditorElements.length < 0) {
      // add this if  editorview and part dont communicate:     this.displayedEditorElements = this.rootInstance.getChildren();

    }
    if (this.displayedEditorElements.length <= 0) {
    const element1 = new ConcreteElement('id1', 'Content 1Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tiere modifiziert. Die Nasenlöcher liegen auf dem Oberschnabel ziemlich weit vorn; dies ermöglicht es dem Schnabeltier, in weitgehend untergetauchtem Zustand ', 'Kommentar: Schnabeltier sind die besten, 10 out of 10, toller Service, gerne wieder', 'Summary 1 Das Schnabeltier (Ornithorhynchus anatinus, englisch platypus) ist ein eierlegendes Säugetier aus Australien. Es ist die einzige lebende Art der Familie der Schnabeltiere (Ornithorhynchidae). Zusammen mit den vier Arten der Ameisenigel bildet es das Taxon der Kloakentiere (Monotremata), die sich stark von allen anderen Säugetieren unterscheiden.');
    const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
    const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');
    const element4 = new ConcreteElement('id4', '\\frac{\\pi}{2}', 'Comment 4', 'Summary 4');

    this.displayedEditorElements = [
      element1, element2, element3, element4
      
    ]; } 

    if (this.displayedEditorElements.length > 0) {
      this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element, this.backendService, this.converter, this.dataService));

      
    } else {
      console.log('Die Liste mit displayedEditorElements ist leer, es wurden keiner layerElements generiert und angezeigt')
    }
  }



  onDragStarted(layerElement: LayerElement) {
    this.draggedLayerElement = layerElement;
    console.log("started drag")

  }

  onDrop(event: any) {
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
  
  

  onDelete(layerElement: LayerElement) {
    layerElement.deleteElement;

  }

  isParent(element: Element): boolean {
    return element instanceof Parent;
  }
  showChildren(layerElement: LayerElement) {
    layerElement.onExtendChild();

  }
  showParent(layerElement : LayerElement) {
    layerElement.onBackToParentClick();
  }


  

  showContent(layerElement: LayerElement): string {
    layerElement.showContentTextbox = !layerElement.showContentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
        // Now you have the LayerElement that matches the hoveredElementID and can access its Content
  
        return layerElementToBeEdited.element.getContent();
      }
    }
    // Return an empty string or any other default value if the element is not found
    return '';
  }


  onContentUpdated(updatedContend: string) {
   
  // Call the backend service to update the summary
  const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
  if (elementToBeSaved) {

  
  const backendResponse: Observable<Object> = this.backendService.EditContent(elementToBeSaved.element, updatedContend);

  const converted: Observable<boolean> = this.converter.convert(backendResponse);
  
  converted.subscribe((value: boolean) => {
    if (value) {
      console.log('Summary updated on the backend.');
      this.dataService.notifyChange();

      
    } else {
      console.log('Error when trying to update the Summary on the backend');
    }
  });
  }
  }


  showComment(layerElement: LayerElement): string {
    layerElement.showCommentTextbox = !layerElement.showCommentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
        // Now you have the LayerElement that matches the hoveredElementID and can access its Content
  
        return layerElementToBeEdited.element.getComment();
      }
    }
    // Return an empty string or any other default value if the element is not found
    return 'Error in showcomment';
  }

  onCommentUpdated(updatedComment: string) {
   
    // Call the backend service to update the summary
    const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
    if (elementToBeSaved) {

    
    const backendResponse: Observable<Object> = this.backendService.EditComment(elementToBeSaved.element, updatedComment);

    const converted: Observable<boolean> = this.converter.convert(backendResponse);
    
    converted.subscribe((value: boolean) => {
      if (value) {
        console.log('Summary updated on the backend.');
        this.dataService.notifyChange();

        // Handle any other logic after the summary is updated, if needed
      } else {
        console.log('Error when trying to update the Summary on the backend');
      }
    });
  }
}

  

  showSummary(layerElement: LayerElement): string  {
    layerElement.showSummaryTextbox = !layerElement.showSummaryTextbox;
    
    
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (layerElementToBeEdited) {
        // Now i have the LayerElement that matches the hoveredElementID adn can acess its Summary

        return layerElementToBeEdited.element.getSummary();

        // Open the text editor with the summary as the content

      }
    }
    return 'error. either nothing is  being hovered or there is no corresponding element currently shown in the editor'
  }

  onSummaryUpdated(updatedSummary: string) {
   
      // Call the backend service to update the summary
      const elementToBeSaved = this.layerElements.find(layerElement => layerElement.element.getId() === this.elementIDToBeEdited);
      if (elementToBeSaved) {

      
      const backendResponse: Observable<Object> = this.backendService.EditSummary(elementToBeSaved.element, updatedSummary);

      const converted: Observable<boolean> = this.converter.convert(backendResponse);
      
      converted.subscribe((value: boolean) => {
        if (value) {
          console.log('Summary updated on the backend.');
          this.dataService.notifyChange();

          // Handle any other logic after the summary is updated, if needed
        } else {
          console.log('Error when trying to update the Summary on the backend');
        }
      });
    }
  }
  
}

