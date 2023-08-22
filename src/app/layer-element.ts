import { ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Element } from './models/element';
import { SummaryComponent } from './summary/summary.component';
import { ContentComponent } from './content/content.component';
import { CommentComponent } from './comment/comment.component';
import { BackendService } from './services/backend.service';
import { Parent } from './models/parent';
import { DataService } from './services/data.service';
import { Observable, tap } from 'rxjs';
import { JsonToModelConverterService } from './services/json-to-model-converter.service';
import { Root } from './models/root';

@Injectable()
/**
 * LayerElement class is responsible for handling different types of interactions
 * with elements including moving, deleting, and extending them.
 */
export class LayerElement {
  element: Element;
  showSummaryTextbox: boolean;
  showContentTextbox: boolean;
  showCommentTextbox: boolean;
  public readonly parent: Element | Root | null;

  /**
   * Constructor for LayerElement.
   * @param element - The element associated with this LayerElement.
   * @param backendService - Service to communicate with the backend.
   * @param converter - Service to convert data from the backend.
   * @param dataService - Service to handle data interactions within the app.
   */
  constructor(
    element: Element,
    private backendService: BackendService,
    private converter: JsonToModelConverterService,
    private dataService: DataService
  ) {
    this.element = element;
    this.parent = element.getParent();
    this.showSummaryTextbox = false;
    this.showContentTextbox = false;
    this.showCommentTextbox = false;
  }

  @ViewChild(SummaryComponent) summaryComponent!: SummaryComponent;
  @ViewChild(ContentComponent) contentComponent!: ContentComponent;
  @ViewChild(CommentComponent) commentComponent!: CommentComponent;

  /**
   * Moves an element within the editor.
   * @param draggedElement - The element being moved.
   * @param newParent - The new parent of the element.
   * @param previousChild - The child element preceding the moved element.
   * @returns An observable that emits a boolean indicating success or failure.
   */
  moveElementEditor(
    draggedElement: Element,
    newParent: Element | Root | null,
    previousChild: Element | null
  ): Observable<boolean> {
    const backendResponse: Observable<object> =
      this.backendService.MoveElementEditor(
        draggedElement,
        newParent,
        previousChild
      );
    return this.converter.convert(backendResponse).pipe(
      tap((value: boolean) => {
        if (value) {
          this.dataService.notifyChange();
        }
      })
    );
  }

  /**
   * Deletes an element. Whether the children should also be deleted is decided by the user.
   */
  deleteElement() {
    const backendResponse: Observable<object> =
      this.backendService.DeleteElement(this.element);
    const converted: Observable<boolean> =
      this.converter.convert(backendResponse);

    converted.subscribe((value: boolean) => {
      if (value) {
        this.dataService.notifyChange();
        this.onBackToParentClick(); // the active element will always be the parent of the deleted one after this, to avoid
      }
    });
  }

  /**
   * Navigates to the parent element of the currently displayed element.
   */
  onBackToParentClick() {
    if (this.parent instanceof Parent) {
      const parentID = this.parent.getId();
      this.dataService.changeActiveElement(parentID);
    }
  }

  /**
   * Expands the child elements of the currently displayed element.
   */
  onExtendChild() {
    if (this.element instanceof Parent) {
      const children = this.element.getChildren();
      const firstChild = children[0];
      const firstChildID: string = firstChild.getId();
      this.dataService.changeActiveElement(firstChildID);
    }
  }

  /**
   * Returns the type of the element.
   * @returns The type of the element as a string.
   */
  getType(): string {
    return typeof this.element;
  }
}
