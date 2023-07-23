import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService
 } from '../services/json-to-model-converter.service';
 import { Observable } from 'rxjs';
 import { DataService } from '../services/data.service';
 import { TextEditorComponent } from '../text-editor/text-editor.component';



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
    this.layerElements = this.displayedEditorElements.map(element => new LayerElement(element));
  }

  onEditButtonClicked() {
    this.inEditMode = true;
  }

  showSummary(): string  {
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

