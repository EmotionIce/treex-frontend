import { Component, OnInit } from '@angular/core';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Parent } from '../models/parent';

export class ConcreteElement extends Element {}

/**
 * Component that represents the editor view of the application.
 */
@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss'],
})
export class EditorViewComponent implements OnInit {
  rootInstance: Root;
  elementIDForEditor: string | null = ''; // ID used to display correct elements in the editor
  elementIDForNaviagtion: string | null = ''; // ID used to display correct elements in navigation
  parentElement: Element | null = null; // Element used to highlight the parent of the currently highlighted element in the editor
  hoveredParentElementID: string | null = null; // ID of the hovered parent element
  hoveredNavElement: string | null = null; // ID of the hovered navigation element
  currentElement: Element | null = null; // Element from which all the other lists of elements are decided
  currentElementID: string | null = null; // ID of the current element

  /**
   * Constructs the EditorViewComponent.
   *
   * @param dataService {DataService} service to manage data
   */
  constructor(private dataService: DataService) {
    this.rootInstance = Root.createRoot();
  }

  /**
   * Initializes the component by subscribing to changes in the active element.
   */
  ngOnInit() {
    this.dataService.currentActiveElementID.subscribe((id) => {
      this.currentElementID = id;
      this.currentElement = this.rootInstance.searchByID(this.currentElementID);
      this.updateEditorView();
    });
  }

  /**
   * Handles changes in the hovered parent element ID.
   *
   * @param parentElementID {string | null} ID of the hovered parent element
   */
  onHoveredParentElementIDChange(parentElementID: string | null) {
    this.hoveredParentElementID = parentElementID;
  }

  /**
   * Handles changes in the hovered navigation element ID.
   *
   * @param elementID {string | null} ID of the hovered navigation element
   */
  onNavParentElementIDChange(elementID: string | null) {
    this.hoveredNavElement = elementID;
  }

  /**
   * Updates the editor view, giving editor part and navigation part the new current element.
   */
  updateEditorView() {
    const parentElement = this.currentElement
      ? this.currentElement.getParent()
      : this.rootInstance;

    if (parentElement instanceof Parent) {
      this.elementIDForNaviagtion = parentElement.getId();
    }

    this.dataService.changeEditorElements(this.currentElementID);
    this.dataService.changeNavigationElements(this.elementIDForNaviagtion);
  }
}
