import { ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Element } from './models/element';
import { SummaryComponent } from './summary/summary.component';
import { ContentComponent } from './content/content.component';
import { CommentComponent } from './comment/comment.component';
import { BackendService } from './services/backend.service';
import { Parent } from './models/parent';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
import { JsonToModelConverterService } from './services/json-to-model-converter.service';
import { Root } from './models/root';

@Injectable()
export class LayerElement {
  element: Element;
  showSummaryTextbox: boolean;
  showContentTextbox: boolean;
  showCommentTextbox: boolean;
  public readonly parent: Element | Root | null;

  constructor(element: Element, private backendService: BackendService,  private converter: JsonToModelConverterService,
    private dataService: DataService) {

    this.element = element;
    this.parent = element.getParent();
    
    this.showSummaryTextbox = false;
    this.showContentTextbox = false;
    this.showCommentTextbox = false;
  }


  @ViewChild(SummaryComponent) summaryComponent!: SummaryComponent;
  @ViewChild(ContentComponent) contentComponent!: ContentComponent;
  @ViewChild(CommentComponent) commentComponent!: CommentComponent;


  
  moveElementEditor(draggedlayerElement: Element, draggedParent: Parent) {                                    //Moves elements whose order the user wants to change using drag and drop
    const backendResponse: Observable<object> = this.backendService.MoveElementEditor(draggedlayerElement, draggedParent, this.element)
    const converted: Observable<boolean> = this.converter.convert(backendResponse);

    converted.subscribe((value: boolean) => {
      if (value) {
        this.dataService.notifyChange(); 
      } 
  
   });
  }

  deleteElement() {                                                                                           //Deletes an element. Whether the children should also be deleted is decided by the user
    
    const backendResponse: Observable<object> = this.backendService.DeleteElement(this.element);
    const converted: Observable<boolean> = this.converter.convert(backendResponse);
  
    converted.subscribe((value: boolean) => {
    if (value) {
      this.onBackToParentClick();                                                                           // the active element will always be the parent of the deleted one after this, to avoid 
    } 

 });
}

  onBackToParentClick() {                                                                                   // Shows the parent element of the currently displayed element
    
    if (this.parent instanceof Parent) {
      const parentID = this.parent.getId();
      this.dataService.changeActiveElement(parentID);
    }
  }

  onExtendChild() {                                                                                         // Expands the child elements of the currently displayed element
    if (this.element instanceof Parent) {

      const children = this.element.getChildren();
      const firstChild = children[0];
      
      const firstChildID: string = firstChild.getId();
      this.dataService.changeActiveElement(firstChildID);
    }
  }
}