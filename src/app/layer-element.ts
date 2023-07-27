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

  moveElementEditor() {



  }

  deleteElement() {
    const backendResponse: Observable<object> = this.backendService.DeleteElement(this.element);
    
    const converted: Observable<boolean> = this.converter.convert(backendResponse);
  
    converted.subscribe((value: boolean) => {
    if (value) {
      console.log('deleted Element');
      this.dataService.notifyChange();
    } else {

    }

 });
}

  onBackToParentClick() {
    if (this.parent instanceof Parent) {
      const parentID = this.parent.getId;
      this.dataService.changeActiveElement(parentID);

    }
    

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