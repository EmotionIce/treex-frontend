import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService
 } from '../services/json-to-model-converter.service';
 import { Observable } from 'rxjs';
 import { DataService } from '../services/data.service';
 import { TextEditorComponent } from '../text-editor/text-editor.component';
 import { EditorViewComponent } from '../editor-view/editor-view.component';


 export class ConcreteElement extends Element {
  // If any additional properties are needed, add them here
}

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {


 

  @Input() displayedEditorElements: Element[] = [];




  layerElements: LayerElement[] = [];
  hoveredElementID: string | null = null; /* the element that is highlighted. need it to highlight its corresponding parent */
  elementIDToBeEdited: string | null = null; /* the ID of the element that is shown in the text-editor. will be acessed after texteditor
                                              is finished to give the backend the correct element */
  inEditMode = false;
//TODO: `give the parent of the ElementID to the navigationpart to display it there



@Output() hoveredElement: EventEmitter<string | null> = new EventEmitter<string | null>();

  onElementHover(elementID: string | null) {
    this.hoveredElementID = elementID;
    this.hoveredElement.emit(this.hoveredElementID);
  }

  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService) {
    // Constructor logic
  }

  ngOnInit() {
    console.log("EditorPartComponent: displayedEditorElements", this.displayedEditorElements);
    console.log('EditorPartComponent: ngOnInit called');
    this.dataService.currentChange.subscribe(change => {
      console.log("Detected change in data", this.displayedEditorElements)
    })
    // Sample data for testing
    const element1 = new ConcreteElement('id1', 'Content 1', 'Comment 1', 'Summary 1 Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tie');
    const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
    const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');

    this.layerElements = [
      new LayerElement(element1),
      new LayerElement(element2),
      new LayerElement(element3)
    ]; 

    if (this.displayedEditorElements.length > 0) {
      this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element));

      
    }

 
    //this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element));
   //TODO uncomment this code once testing is done!

   console.log("EditorPartComponent: layerElements", this.layerElements);
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

