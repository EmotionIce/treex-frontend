import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Input,
  ViewChildren, 
  QueryList,
  OnChanges, 
  SimpleChanges
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
import { MatIconModule } from '@angular/material/icon';
import { DragDrop } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss'],
})
export class EditorPartComponent implements OnInit {
  @Input() navElementHoverID: string | null = null;

  @ViewChildren('scrollToElement') elementRefs!: QueryList<ElementRef>;
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
  showAddElementTextEditor: boolean = false;
  newContent: string = '';
  

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
            this.updateEditor();
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

      
    });

 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('navElementHoverID' in changes) {
      const currentValue: string | null = changes['navElementHoverID'].currentValue;
      

      // Call a method or perform actions based on the input change
      if (currentValue !== null) {
        this.scrollToNavElementChildren();

      }
      
    }
  }

  scrollToNavElementChildren() {
    
      let matchingElement: LayerElement;
      for (const layerElement of this.layerElements) {
        if (this.onNavElementHover(layerElement)) {
          matchingElement = layerElement;
          const matchingElementID = layerElement.element.getId();
          this.scrollTo(matchingElementID);
          console.log("this is the first element that i found", matchingElement.element.getContent());
          break;


        }
      }
  
      


    
    
   

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
    this.scrollTo(this.editorParentElementID)
  }
  scrollTo(layerElementId: string) {
    setTimeout(() => {
      const elementToScroll = this.layerElements.find(layerElement => layerElement.element.getId() === layerElementId);
  
      if (elementToScroll) {
        const elementRef = this.elementRefs.toArray()[this.layerElements.indexOf(elementToScroll)];
        if (elementRef) {
          elementRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        console.log(`Layer element with ID ${layerElementId} not found.`);
      }
  
      // Reset scroll position of app component
      document.documentElement.scrollTop = 0;
    }, 0); // Adjust the delay as needed
  }

  onElementHover(elementID: string | null) {
    //gives hoveredElement to editorview
    this.hoveredElementID = elementID;
    console.log("i can still hover", this.hoveredElementID);

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
    onDragStart(layerElement: LayerElement) {

    }
  

  onDragStarted(event: CdkDragStart, layerElement: any) {
    //saves the element that is being dragged
    this.draggedLayerElement = layerElement;
    if(this.draggedLayerElement) {
      const draggedElementID = this.draggedLayerElement.element.getId();
      this.dataService.changeDraggedElement(draggedElementID); //gives the ID of the dragged Element to other components so they can accept this element as drop
    }
    
    event.source.element.nativeElement.classList.add('dragging');
    setTimeout(() => {
      const draggingElement = document.querySelector('.cdk-drag-placeholder');
      if (draggingElement) {
        draggingElement.classList.add('dragging');
      }
    });
    console.log(event.source.element.nativeElement.classList.value);
  }
/*
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
      droppedLayerElement
        .moveElementEditor(draggedElement, targetparent, tartgetElement)
        .subscribe((value) => {
          if (value) {
            this.updateEditor();
          }
        });
    }
    this.draggedLayerElement = null;
    this.dataService.changeDraggedElement(null);
  } */
  onDrop(event: CdkDragDrop<any[]>) {
    const dropIndex = event.currentIndex;
    console.log(`Editor Element was dropped at index: ${dropIndex}`);
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

  parentInstanceOfParent(layerElement: LayerElement): boolean {
    //checks if the parent of the element is an instance of parent
    if (layerElement.element.getParent() instanceof Parent) {
      return true;
    }
    return false;
  }

  toggleEmptyTextEditor() { //Toggles the texteditor for a new element
    this.showAddElementTextEditor = !this.showAddElementTextEditor;
    if (!this.showAddElementTextEditor) {
      this.newContent = ''; // Clear the new content when hiding the section
    }
  }

  // Function to handle the textUpdated event of the new content text editor
  onNewElement(content: string) { //gives new element to the backend
    this.newContent = content;
    //TODO call backendservice, give necessary information, update Editor
  }
}
