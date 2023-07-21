import { Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Element } from './models/element';
import { SummaryComponent } from './summary/summary.component';
import { ContentComponent } from './content/content.component';
import { CommentComponent } from './comment/comment.component';

export class LayerElement {
  @Input() element!: Element;


  @Output() hoveredElement: EventEmitter<string> = new EventEmitter<string>();
  onElementHover(isHovered: boolean) {
    if (isHovered) {
      this.hoveredElement.emit(this.element.getId());
    }
}

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