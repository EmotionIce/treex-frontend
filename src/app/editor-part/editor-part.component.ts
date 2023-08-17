import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../services/data.service';
import { Parent } from '../models/parent';
import { SettingsService } from '../services/settings';
import { Root } from '../models/root';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
  CdkDragStart,
  CdkDragEnd,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { LatexRenderComponent } from '../latex-render/latex-render.component';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

export class ConcreteElement extends Element {
  //temporary class to test elements
}

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss'],
})
export class EditorPartComponent implements OnInit {
  @Input() navElementHoverID: string | null = null;

  @ViewChild('currentScrollElement', { read: ElementRef, static: false })
  currentScrollElement!: ElementRef;
  settings: any;
  displayedEditorElements: Element[] = []; //the list of elements that are supposed to be shown
  layerElements: LayerElement[] = []; //the list of layerElements that are shown
  editorParentElementID: string | null = null; //the ID of the element that is used for root.getElementsOfLayer(element)
  editorParentElement: Element | null = null; //the element that is used for root.getElementsOfLayer(element)
  parentElementID: string | null = null; //the ID of the element that goes to the navigationpart to be highlighted there
  hoveredParentID: string | null = null; //element that goes to the navigationpart to be highlighted there
  hoveredElementID: string | null = null; //the element that is highlighted. need it to highlight its corresponding parent
  elementIDToBeEdited: string | null = null; // the ID of the element that is shown in the text-editor. will be acessed after texteditor
  //is finished to give the backend the correct element
  inEditMode = false; //checks whether a text is supposed to be shown in edit mode
  draggedLayerElement: LayerElement | null = null; //the element that is being dragged

  rootInstance: Root;

  @Output() parentElementIDChange: EventEmitter<string | null> =
    new EventEmitter<string | null>();

  constructor(
    private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {
    this.rootInstance = Root.createRoot();
  }

  ngOnInit() {
    this.backendService.LoadFullData().subscribe(
      (fullData: Object) => {
        // Once you have the fullData, pass it to the JsonToModelConverterService's convert method
        const converted: Observable<boolean> = this.converter.convert(
          of(fullData)
        );

        converted.subscribe((value: boolean) => {
          if (value) {
            // Conversion successful, do something if needed
          } else {
            // Conversion failed, handle the error if needed
          }
        });
      },
      (error) => {
        console.error('Error fetching full data:', error);
      }
    );
    this.settings = this.settingsService.getSettings();
    this.updateEditor();

    this.dataService.currentEditorElements.subscribe((newEditorElements) => {
      this.updateEditor();
    });
    this.dataService.currentChange.subscribe((change) => {
      //should elements be changed, the dataservice.notifyChange will call this to update the elements in the editor.
      this.updateEditor();

      if (this.editorParentElementID && this.currentScrollElement) {
        this.currentScrollElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });

    /* if (this.displayedEditorElements.length <= 0) { //test elements used to test the layerElement boxes
     const element1 = new ConcreteElement('id1', 'Content 1Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tiere modifiziert. Die Nasenlöcher liegen auf dem Oberschnabel ziemlich weit vorn; dies ermöglicht es dem Schnabeltier, in weitgehend untergetauchtem Zustand ', 'Kommentar: Schnabeltier sind die besten, 10 out of 10, toller Service, gerne wieder', 'Summary 1 Das Schnabeltier (Ornithorhynchus anatinus, englisch platypus) ist ein eierlegendes Säugetier aus Australien. Es ist die einzige lebende Art der Familie der Schnabeltiere (Ornithorhynchidae). Zusammen mit den vier Arten der Ameisenigel bildet es das Taxon der Kloakentiere (Monotremata), die sich stark von allen anderen Säugetieren unterscheiden.');
     const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
     const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');
     const element4 = new ConcreteElement('id4', '\\frac{\\pi}{2}', 'Comment 4', 'Summary 4');

     this.displayedEditorElements = [
       element1, element2, element3, element4

     ]; }  */
  }
  /*
  ngAfterViewInit() {                               //responsible for scrolling down to the currentElement
    if (this.editorParentElementID) {
      const currentScrollElement = this.currentElementRef.nativeElement as HTMLElement;
      if (currentScrollElement) {
        currentScrollElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
*/

  updateEditor() {
    /*
  {this.backendService.LoadFullData().subscribe(
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

      console.error('Error fetching full data:', error);
    }
  );
  } */
    this.editorParentElementID = this.dataService.getEditorElement();
    console.log(
      'updateEditor was just pressed and the editorParentElementID is this:',
      this.editorParentElementID
    );
    if (this.editorParentElementID.length === 0) {
      //at the beginning of the program the editor shows the direct children of the root
      this.displayedEditorElements = this.rootInstance.getChildren();
      this.layerElements = this.displayedEditorElements.map(
        (element) =>
          new LayerElement(
            element,
            this.backendService,
            this.converter,
            this.dataService
          )
      );
      this.cdr.detectChanges();
    } else {
      this.editorParentElement = this.rootInstance.searchByID(
        this.editorParentElementID
      );
      if (this.editorParentElement) {
        this.displayedEditorElements = this.rootInstance.getElementsOfLayer(
          this.editorParentElement
        );
        this.layerElements = this.displayedEditorElements.map(
          (element) =>
            new LayerElement(
              element,
              this.backendService,
              this.converter,
              this.dataService
            )
        );
        this.cdr.detectChanges();
      }
    }
  }

  onElementHover(elementID: string | null) {
    //gives hoveredElement to editorview
    this.hoveredElementID = elementID;

    if (elementID) {
      this.parentElementIDChange.emit(this.hoveredElementID);
      /*
      const element = this.rootInstance.searchByID(elementID);
      if (element instanceof Element) {
        const parentElement = element.getParent();

        if (parentElement instanceof Element) {
          this.parentElementID = parentElement.getId();
          this.parentElementIDChange.emit(this.parentElementID);
        }
      }*/
    } else {
      this.parentElementIDChange.emit(null);
    }
  }
  onNavElementHover(layerElement: LayerElement): boolean {
    //console.log('i got an input from nav', this.navElementHoverID);
    if (this.navElementHoverID) {
      const navElementHover = this.rootInstance.searchByID(
        this.navElementHoverID
      );
      if (navElementHover instanceof Parent) {
        const navElementChildren = navElementHover.getChildren(); // Call the function

        for (const child of navElementChildren) {
          if (child === layerElement.element) {
            return true;
          }
        }
      }
    }
    return false;
  }

  onDragStarted(event: CdkDragStart, layerElement: any) {
    //saves the element that is being dragged
    this.draggedLayerElement = layerElement;
    event.source.element.nativeElement.classList.add('dragging');
    setTimeout(() => {
      const draggingElement = document.querySelector('.cdk-drag-placeholder');
      if (draggingElement) {
        draggingElement.classList.add('dragging');
      }
    });
    console.log(event.source.element.nativeElement.classList.value);
  }

  onDrop(event: CdkDragEnd, dropList: CdkDropList) {
    // Find the drop target
    const dropTargetIndex = dropList.getSortedItems().indexOf(event.source);
    const droppedLayerElement = this.layerElements[dropTargetIndex];

    console.log(
      'dropped this element: ',
      this.draggedLayerElement?.element,
      'on this element: ',
      this.rootInstance.searchByID(
        this.hoveredElementID ? this.hoveredElementID : 'null'
      )
    );
    console.log(dropList.getSortedItems());

    event.source.element.nativeElement.classList.remove('dragging');
    const draggedElement = this.draggedLayerElement?.element;

    const tartgetElement = this.rootInstance.searchByID(
      this.hoveredElementID ? this.hoveredElementID : 'null'
    );

    const targetparent = tartgetElement ? tartgetElement.getParent() : null;

    if (draggedElement) {
      droppedLayerElement.moveElementEditor(
        draggedElement,
        targetparent,
        tartgetElement
      );
    }
    this.draggedLayerElement = null;
  }

  onDelete(layerElement: LayerElement) {
    //calles deleteElement in layerElement
    layerElement.deleteElement();
  }

  isParent(element: Element): boolean {
    //checks if element is type of parent
    return element instanceof Parent;
  }
  showChildren(layerElement: LayerElement) {
    //calles onExtendChild in layerElement
    layerElement.onExtendChild();
  }
  showParent(layerElement: LayerElement) {
    //calles onBackToParentClick in layerElement
    layerElement.onBackToParentClick();
  }

  showContent(layerElement: LayerElement): string {
    //when the user presses the showContent button it shows the content in an editable window
    layerElement.showContentTextbox = !layerElement.showContentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(
        (layerElement) =>
          layerElement.element.getId() === this.elementIDToBeEdited
      );
      if (layerElementToBeEdited) {
        return layerElementToBeEdited.element.getContent();
      }
    }

    return '';
  }

  onContentUpdated(updatedContend: string) {
    const elementToBeSaved = this.layerElements.find(
      (layerElement) =>
        layerElement.element.getId() === this.elementIDToBeEdited
    );

    if (elementToBeSaved) {
      const backendResponse: Observable<any> = this.backendService
        .EditContent(elementToBeSaved.element, updatedContend)
        .pipe(
          catchError((error: Error) => {
            // Log the error to the console
            console.error('Error from backend:', error.message);
            return throwError(() => error); // Use a factory function for throwError
          })
        );

      const converted: Observable<boolean> =
        this.converter.convert(backendResponse);

      converted.subscribe((value) => {
        if (value) {
          this.dataService.notifyChange();
        }
      });
    }
  }

  showComment(layerElement: LayerElement): string {
    //when the user presses the showComment button it shows the comment in an editable window
    layerElement.showCommentTextbox = !layerElement.showCommentTextbox;
    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(
        (layerElement) =>
          layerElement.element.getId() === this.elementIDToBeEdited
      );
      if (layerElementToBeEdited) {
        const comment = layerElementToBeEdited.element.getComment();
        if (comment === null || comment.trim() === '') {
          // If the comment is empty or null, set the default text
          return 'No comment yet';
        }

        // If the comment is not empty, show the actual comment
        return comment;
      }
    }

    return 'Error in showcomment';
  }

  onCommentUpdated(updatedComment: string) {
    //gives backend the new comment
    if (updatedComment !== 'Ist leer') {
      //if the comment has the text "ist leer, the user did not change it. In this case the backend will not be notified, to avoid giving the element the comment "ist leer"

      const elementToBeSaved = this.layerElements.find(
        (layerElement) =>
          layerElement.element.getId() === this.elementIDToBeEdited
      );
      if (elementToBeSaved) {
        const backendResponse: Observable<Object> =
          this.backendService.EditComment(
            elementToBeSaved.element,
            updatedComment
          );

        const converted: Observable<boolean> =
          this.converter.convert(backendResponse);

        converted.subscribe((value: boolean) => {
          if (value) {
            this.dataService.notifyChange();
          }
        });
      }
    } else {
      console.log(
        'Kommentar wurde nicht bearbeitet, Änderungen werden nicht vorgenommen'
      );
    }
  }

  showSummary(layerElement: LayerElement): string {
    //when the user presses the showSummary button it shows the summary in an editable window
    layerElement.showSummaryTextbox = !layerElement.showSummaryTextbox;

    if (this.hoveredElementID) {
      this.elementIDToBeEdited = this.hoveredElementID;
      const layerElementToBeEdited = this.layerElements.find(
        (layerElement) =>
          layerElement.element.getId() === this.elementIDToBeEdited
      );
      if (layerElementToBeEdited) {
        if (layerElementToBeEdited.element.getSummary() === 'null') {
          return 'Die Zusammenfassung diesen Elements is leer';
        }

        return layerElementToBeEdited.element.getSummary();
      }
    }
    return 'error. either nothing is  being hovered or there is no corresponding element currently shown in the editor';
  }

  onSummaryUpdated(updatedSummary: string) {
    //gives the backend the new summary

    // Call the backend service to update the summary
    const elementToBeSaved = this.layerElements.find(
      (layerElement) =>
        layerElement.element.getId() === this.elementIDToBeEdited
    );
    if (elementToBeSaved) {
      const backendResponse: Observable<Object> =
        this.backendService.EditSummary(
          elementToBeSaved.element,
          updatedSummary
        );

      const converted: Observable<boolean> =
        this.converter.convert(backendResponse);

      converted.subscribe((value: boolean) => {
        if (value) {
          this.dataService.notifyChange();
        } else {
        }
      });
    }
  }
}
