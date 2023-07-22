import { ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Element } from './models/element';
import { SummaryComponent } from './summary/summary.component';
import { ContentComponent } from './content/content.component';
import { CommentComponent } from './comment/comment.component';

@Injectable()
export class LayerElement {
  element: Element;

  constructor(element: Element) {
    this.element = element;
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

  }
}