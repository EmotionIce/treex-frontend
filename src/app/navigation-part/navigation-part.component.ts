import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Root } from '../models/root';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import {
  CdkDragDrop,
  CdkDragStart,
  CdkDragEnd,
  CdkDragEnter,
  CdkDragExit,
} from '@angular/cdk/drag-drop';

export class ConcreteElement extends Element {}

/**
 * Component that represents the navigation part of the application.
 */
@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss'],
})
export class NavigationPartComponent implements OnInit {
  @Input() parentElementID: string | null = null;
  @Output() navParentElementIDChange = new EventEmitter<string | null>();
  hoveredElementID: string | null = null; // The element that is highlighted. Needed to highlight its corresponding children
  displayedNavigationElements: Element[] = []; // The elements from root
  rootInstance: Root;
  parentElement: Element | null = null; // This element gives back the displayedNavigationElements using root.getElementsOfLayer
  navigationParentElementID: string | null = null; // The ID of the parentElement
  layerElements: LayerElement[] = []; // The list of layerElements that are to be shown
  hoveredNavElementID: string | null = null;
  isDropAreaHovered = false;
  draggedElementServiceID: string | null = null; // The element that the service brings should another component have an element dragged
  draggedElementID: string | null = null; // The element that is dragged in this component

  /**
   * Constructs the NavigationPartComponent.
   * @param backendService service to interact with the backend
   * @param converter service to convert JSON to internal model
   * @param dataService service for managing shared data across components
   */
  constructor(
    private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService
  ) {
    this.rootInstance = Root.createRoot();
  }

  /**
   * Initializes the component by subscribing to changes in the navigation elements and the currently active element.
   */
  ngOnInit() {
    this.dataService.currentNavigationElements.subscribe(
      (newNavigationElements) => {
        // responsible for changing the displayed Elements
        this.updateNavigation(); // will happen e.g. when the user presses ExtendChild Button
      }
    );

    this.dataService.currentChange.subscribe((change) => {
      //updates the currently shown element
      this.updateNavigation(); //happens when elements are changed
    });
    this.updateNavigation();

    this.dataService.currentDraggedElement.subscribe(
      (newDraggedElementOtherComponent) => {
        this.draggedElementServiceID = newDraggedElementOtherComponent;
      }
    );
  }

  /**
   * Updates the navigation elements according to the current navigation parent element ID.
   */
  updateNavigation() {
    this.navigationParentElementID = this.dataService.getNavigationElement();
    if (this.navigationParentElementID.length !== 0) {
      this.parentElement = this.rootInstance.searchByID(
        this.navigationParentElementID
      );
      if (this.parentElement) {
        this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(
          this.parentElement
        );
        this.layerElements = this.displayedNavigationElements.map(
          (element) =>
            new LayerElement(
              element,
              this.backendService,
              this.converter,
              this.dataService
            )
        );
      }
    }
  }

  /**
   * Handles navigation element hover, and highlights children in the editor part.
   * @param elementID - The ID of the hovered element.
   */
  onNavElementHover(elementID: string | null) {
    //gives the hovered Element to to editorpart so it can highlight its children
    this.hoveredNavElementID = elementID;

    if (elementID) {
      this.navParentElementIDChange.emit(this.hoveredNavElementID);
    } else {
      this.navParentElementIDChange.emit(null);
    }
  }

  /**
   * Returns the first 40 characters of the content.
   * @param content - The content string to be truncated.
   * @returns The truncated content.
   */
  getFirstFourtyLetters(content: string): string {
    //takes the first 40 letters of the content to display them
    if (content) {
      return content.slice(0, 40);
    }
    return 'empty content';
  }

  /**
   * Checks which element has the same ID as the element that is to be highlighted.
   * @param layerElement - The layer element to check.
   * @returns True if the element is to be highlighted, false otherwise.
   */
  highlightElement(layerElement: LayerElement): boolean {
    // checks which element has the same ID as the element that is to be highlighted
    if (this.parentElementID) {
      const element = this.rootInstance.searchByID(this.parentElementID);
      if (element instanceof Element) {
        const parentElement = element.getParent();

        if (parentElement instanceof Element) {
          const highlightParent = parentElement.getId();

          return highlightParent === layerElement.element.getId(); //so the parentElement is highlighted when the user hovers elements in editorpart
        }
      }
    }
    return false;
  }

  /**
   * Handler for drag start event.
   */
  onDragStart() {
    this.draggedElementID = this.hoveredNavElementID;
    console.log('dragging Element: ', this.draggedElementID);
    this.dataService.changeDraggedElement(this.draggedElementID);
    this.draggedElementServiceID = this.draggedElementID;
  }

  /**
   * Handler for drop event.
   * @param event - The drag-drop event object.
   */
  onDrop(event: CdkDragDrop<any[]>) {
    const dropIndex = event.currentIndex;
    console.log(`Element was dropped at index: ${dropIndex}`);

    if (dropIndex >= 0 && dropIndex < this.displayedNavigationElements.length) {
      const previousElement =
        dropIndex === 0
          ? null
          : this.displayedNavigationElements[dropIndex - 1];
      const previousLayerElement = this.layerElements[dropIndex];
      let parent: Element | Root | null = null;
      if (previousElement === null) {
        const tempElement = this.displayedNavigationElements[0]; //if the previous element = null then there is none, but the backend still needs a parent element to know where the new element is to be added.
        //so another element in the same layer is taken and its parent is sent to the backend

        parent = tempElement.getParent();
        if (parent instanceof Root) {
          parent = null;
        }
      } else {
        parent = previousElement.getParent();
        if (parent instanceof Root) {
          parent = null;
        }
      }
      if (this.draggedElementServiceID) {
        const draggedElement = this.rootInstance.searchByID(
          this.draggedElementServiceID
        );

        console.log(
          'dragged: ',
          draggedElement,
          ' parent: ',
          parent,
          ' previousElement: ',
          previousElement
        );

        if (draggedElement) {
          previousLayerElement
            .moveElementEditor(draggedElement, parent, previousElement)
            .subscribe((value) => {
              if (value) {
                this.dataService.notifyChange();
              }
            });
        }
      }
    }
    this.dataService.changeDraggedElement(null);
  }

  /**
   * TrackBy function for ngFor loops.
   * @param index - Index of the element.
   * @param item - LayerElement item.
   * @returns The ID of the element.
   */
  trackByFn(index: number, item: LayerElement): string {
    return item.element.getId();
  }
}
