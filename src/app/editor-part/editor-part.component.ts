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
  SimpleChanges,
} from '@angular/core';
import { Element } from '../models/element';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../services/data.service';
import { Parent } from '../models/parent';
import { SettingsService } from '../services/settings.service';
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
import { catchError, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { DragDrop } from '@angular/cdk/drag-drop';
import { ErrorPopupService } from '../services/error-popup.service';
import { Figure } from '../models/environments/figure';

/**
 * EditorPartComponent is responsible for displaying and managing the editor view of LaTeX documents.
 * It allows users to edit, restructure, and navigate the content.
 */
@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss'],
})
export class EditorPartComponent implements OnInit {
  @Input() navElementHoverID: string | null = null;

  @ViewChildren('scrollToElement') elementRefs!: QueryList<ElementRef>;

  @ViewChild('textEditorRef', { static: false, read: ElementRef })
  textEditor!: ElementRef;
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
  draggedElement: Element | null = null; //the element that is being dragged
  showAddElementTextEditor: boolean = false;
  newContent: string = '';

  rootInstance: Root;

  @Output() parentElementIDChange: EventEmitter<string | null> =
    new EventEmitter<string | null>();

  /**
   * @param backendService The backend service responsible for communication with the server
   * @param converter The service responsible for converting JSON to the composite data structure
   * @param dataService The service responsible for managing the data within the app
   * @param settingsService The service responsible for managing user settings
   * @param cdr Change detector reference to handle UI updates
   * @param errorPopupService The service responsible for displaying error popups
   */
  constructor(
    private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef,
    private errorPopupService: ErrorPopupService
  ) {
    this.rootInstance = Root.createRoot();
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit() {
    this.backendService.LoadFullData().subscribe(
      (fullData: Object) => {
        // Once you have the fullData, pass it to the JsonToModelConverterService's convert method
        const converted: Observable<boolean> = this.converter.convert(
          of(fullData)
        );

        converted.subscribe((value: boolean) => {
          if (value) {
            this.dataService.notifyChange();
            this.dataService.setDataImportStatus(true);
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
    //this.updateEditor();

    this.dataService.currentEditorElements.subscribe((newEditorElements) => {
      this.updateEditor();
    });
    this.dataService.currentChange.subscribe((change) => {
      console.log('Elements changed. Updating editor part.');
      //should elements be changed, the dataservice.notifyChange will call this to update the elements in the editor.
      this.updateEditor();
      if (this.editorParentElementID && this.currentScrollElement) {
        this.currentScrollElement.nativeElement.scrollIntoView({
          behavior: 'auto',
        });
      }
    });

    this.dataService.currentDraggedElement.subscribe(
      (draggedElement: string | null) => {
        if (!draggedElement) return;
        this.draggedElement = this.rootInstance.searchByID(draggedElement);
      }
    );
  }

  /**
   * Handles changes to Angular component's input properties.
   * @param changes - An object containing the current and previous property values
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('navElementHoverID' in changes) {
      const currentValue: string | null =
        changes['navElementHoverID'].currentValue;

      // Call a method or perform actions based on the input change
      if (currentValue !== null) {
        this.scrollToNavElementChildren();
      }
    }
  }

  /**
   * Scrolls to the children of the navigation element that is being hovered over.
   */
  scrollToNavElementChildren() {
    let matchingElement: LayerElement;
    for (const layerElement of this.layerElements) {
      if (this.onNavElementHover(layerElement)) {
        matchingElement = layerElement;
        const matchingElementID = layerElement.element.getId();
        this.scrollTo(matchingElementID);
        console.log(
          'this is the first element that i found',
          matchingElement.element.getContent()
        );
        break;
      }
    }
  }

  /**
   * Updates the editor view by retrieving the parent element ID and scrolling to it.
   */
  updateEditor() {
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
    this.scrollTo(this.editorParentElementID);
  }

  /**
   * Scrolls to a specific layer element within the view.
   * @param layerElementId - The ID of the layer element to scroll to
   */
  scrollTo(layerElementId: string) {
    setTimeout(() => {
      const elementToScroll = this.layerElements.find(
        (layerElement) => layerElement.element.getId() === layerElementId
      );

      if (elementToScroll) {
        const elementRef =
          this.elementRefs.toArray()[
            this.layerElements.indexOf(elementToScroll)
          ];
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

  /**
   * Handles when an element is hovered.
   * @param elementID - The ID of the element being hovered
   */
  onElementHover(elementID: string | null) {
    //gives hoveredElement to editorview
    this.hoveredElementID = elementID;
    console.log('i can still hover', this.hoveredElementID);

    if (elementID) {
      this.parentElementIDChange.emit(this.hoveredElementID);
    } else {
      this.parentElementIDChange.emit(null);
    }
  }

  /**
   * Checks if a given navigation element is being hovered.
   * @param layerElement - The layer element to check
   * @returns True if the element is being hovered, false otherwise
   */
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

  /**
   * Handles when a drag operation starts on a layer element.
   * @param layerElement - The layer element being dragged
   */
  onDragStart(layerElement: LayerElement) {
    this.draggedLayerElement = layerElement;
    this.dataService.changeDraggedElement(
      this.draggedLayerElement.element.getId()
    );
  }

  /**
   * Handles when a drag operation ends and a drop event occurs.
   * @param event - The drag-and-drop event data
   */
  onDrop(event: CdkDragDrop<any[]>) {
    const dropIndex = event.currentIndex;

    if (this.draggedLayerElement?.element.getId() === this.hoveredElementID)
      return;

    const draggedElement = this.draggedElement;
    this.dataService.changeDraggedElement(null);
    if (!draggedElement) return console.log('draggedElement is null');

    const tartgetElement: Element = this.displayedEditorElements[dropIndex - 1];

    let targetparent: Root | Element | null;

    if (tartgetElement) {
      targetparent = tartgetElement ? tartgetElement.getParent() : null;
    } else {
      targetparent = this.displayedEditorElements[0].getParent();
    }

    if (
      targetparent instanceof Element &&
      draggedElement.getId() === targetparent.getId()
    )
      return this.errorPopupService.setErrorMessage(
        'Ein Element kann nicht unter sich selbst geschoben werden.'
      );

    console.log(
      'dropped this element: ',
      draggedElement,
      'previous child: ',
      tartgetElement,
      'parent is: ',
      targetparent
    );
    const backendResponse: Observable<object> =
      this.backendService.MoveElementEditor(
        draggedElement,
        targetparent,
        tartgetElement
      );
    return this.converter
      .convert(backendResponse)
      .subscribe((value: boolean) => {
        if (value) {
          console.log('move successful');
          this.dataService.notifyChange();
        } else {
          // Conversion failed, handle the error if needed
        }
      });
  }

  /**
   * Deletes the specified layer element.
   * @param layerElement - The layer element to delete
   */
  onDelete(layerElement: LayerElement) {
    //calles deleteElement in layerElement
    layerElement.deleteElement();
  }

  /**
   * Determines if the given element is a Parent and has children.
   * @param element - The element to check
   * @returns True if the element is a Parent and has children, false otherwise
   */
  isParent(element: Element): boolean {
    //checks if element is type of parent
    return element instanceof Parent && element.getChildren().length > 0;
  }

  /**
   * Shows the children of the given layer element.
   * @param layerElement - The layer element to show children of
   */
  showChildren(layerElement: LayerElement) {
    //calles onExtendChild in layerElement
    layerElement.onExtendChild();
  }

  /**
   * Shows the parent of the given layer element.
   * @param layerElement - The layer element to show parent of
   */
  showParent(layerElement: LayerElement) {
    //calles onBackToParentClick in layerElement
    layerElement.onBackToParentClick();
  }

  /**
   * Toggles the display of content for the specified layer element and retrieves its content as a string.
   * @param layerElement - The layer element to show content of
   * @returns Content as a string
   */
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

  /**
   * Handles when content is updated.
   * @param updatedContend - The updated content
   */
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

  /**
   * Toggles the display of comment for the specified layer element and retrieves its comment as a string.
   * @param layerElement - The layer element to show comment of
   * @returns Comment as a string
   */
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

  /**
   * Handles when a comment is updated.
   * @param updatedComment - The updated comment
   */
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

  /**
   * Toggles the display of summary for the specified layer element and retrieves its summary as a string.
   * @param layerElement - The layer element to show summary of
   * @returns Summary as a string
   */
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

  /**
   * Handles when a summary is updated.
   * @param updatedSummary - The updated summary
   */
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

  /**
   * Checks if the parent of the given layer element is an instance of Parent.
   * @param layerElement - The layer element to check
   * @returns True if the parent of the element is an instance of Parent, false otherwise
   */
  parentInstanceOfParent(layerElement: LayerElement): boolean {
    //checks if the parent of the element is an instance of parent
    if (layerElement.element.getParent() instanceof Parent) {
      return true;
    }
    return false;
  }

  /**
   * Toggles the text editor for adding a new element.
   * When toggled on, the text editor is scrolled into view.
   * When toggled off, the content of the new element is cleared.
   */
  toggleEmptyTextEditor() {
    // Toggles the text editor for a new element
    this.showAddElementTextEditor = !this.showAddElementTextEditor;
    console.log('new element editor is shown: ', this.showAddElementTextEditor);

    if (!this.showAddElementTextEditor) {
      this.newContent = ''; // Clear the new content when hiding the section
    }
    if (this.showAddElementTextEditor) {
      setTimeout(() => {
        this.textEditor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }

  /**
   * Handles the textUpdated event of the new content text editor.
   * Gives new element content to the backend and triggers the data conversion.
   * If the conversion is successful, notifies the data change.
   *
   * @param {string} content - The new content for the element.
   */
  onNewElement(content: string) {
    // Gives new element to the backend
    this.newContent = content;
    this.showAddElementTextEditor = false;

    let lastElement: Element | null =
      this.displayedEditorElements[this.displayedEditorElements.length - 1];

    let lastElementParent = lastElement.getParent();

    const backendResponse: Observable<Object> = this.backendService.AddElement(
      this.newContent,
      lastElementParent,
      lastElement
    );
    const converted: Observable<boolean> =
      this.converter.convert(backendResponse);

    converted.subscribe((value: boolean) => {
      if (value) {
        this.dataService.notifyChange();
      } else {
        // Handle failure scenario (if needed)
      }
    });
  }

  /**
   * Retrieves the image of the given figure element in base64 format.
   * Returns undefined if the provided element is not a Figure.
   *
   * @param {Element | undefined} element - The element for which to get the image.
   * @returns {string | undefined} The base64 representation of the image or undefined.
   */
  getFigureImage(element: Element | undefined): string {
    const notFoundString: string = '/assets/images/not_found.png';
    if (element instanceof Figure) {
      const content = element.getContent();
      const mimeType = element.getMimeType();

      if (content)
        return (
          'data:' + element.getMimeType() + ';base64,' + element.getImage()
        );
      return notFoundString;
    }
    return notFoundString;
  }

  isContentEmpty(element: Element | undefined): boolean {
    if (element instanceof Figure) {
      return !element.getContent();
    }
    return true; // default to true (considering content as empty) if element isn't an instance of Figure
  }
}
