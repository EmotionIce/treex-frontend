import { ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Element } from './models/element';
import { SummaryComponent } from './summary/summary.component';
import { ContentComponent } from './content/content.component';
import { CommentComponent } from './comment/comment.component';
import { BackendService } from './services/backend.service';
import { Parent } from './models/parent';
import { DataService } from './services/data.service';

@Injectable()
export class LayerElement {
  element: Element;
  showSummaryTextbox: boolean;
  showContentTextbox: boolean;
  showCommentTextbox: boolean;

  constructor(element: Element, private backendService: BackendService, private dataService: DataService) {
    this.element = element;
    
    this.showSummaryTextbox = false;
    this.showContentTextbox = false;
    this.showCommentTextbox = false;
  }




  @ViewChild(SummaryComponent) summaryComponent!: SummaryComponent;
  @ViewChild(ContentComponent) contentComponent!: ContentComponent;
  @ViewChild(CommentComponent) commentComponent!: CommentComponent;

  moveElementEditor() {

  }

  deleteElement() {

  }

  onBackToParentClick() {

  }

  onExtendChild() {
    if (this.element instanceof Parent) {
      // Type assertion to treat the element as Parent to access the getChildren() method
      const parentElement = this.element as Parent;
      
      // Access the list of children using the getChildren() method
      const children = parentElement.getChildren();
      const firstChild = children[0];
      const firstChildID: string = firstChild.getId();
      console.log("the layerElement concluded a new activeElement:", firstChildID)
      this.dataService.changeActiveElement(firstChildID);

      
    }

  }
}