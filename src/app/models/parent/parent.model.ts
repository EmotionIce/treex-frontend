// parent.model.ts

import { Element } from '../element/element.model';
import { ParentType } from '../parent-type';

export class Parent extends Element {
  private children: Element[] = [];

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    public type: ParentType,
    parent?: Element
  ) {
    super(id, content, comment, summary, parent);
  }

  // Method to add a child
  public addChild(child: Element): void {
    this.children.push(child);
    child.changeParent(this); // Also update the parent of the child
  }

  // Method to remove a child
  public removeChild(child: Element): void {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.children.splice(index, 1);
      child.changeParent(undefined); // Also update the parent of the child
    }
  }

  // Method to get all children
  public getChildren(): Element[] {
    return this.children;
  }
}
