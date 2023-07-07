import { Element } from './element';
import { Root } from './root';

export abstract class Parent extends Element {
  private children: Element[];

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Element | Root | null = null
  ) {
    super(id, content, comment, summary, parent);
    this.children = [];
  }

  public addChild(child: Element): void {
    this.children.push(child);
  }

  public removeChild(childId: string): boolean {
    const index = this.children.findIndex((child) => child.getId() === childId);
    if (index > -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  public getPrevious(e: Element): Element | null {
    const index = this.children.findIndex(
      (child) => child.getId() === e.getId()
    );
    if (index > 0) {
      return this.children[index - 1];
    }
    return null;
  }

  public override getChildren(): Element[] {
    return this.children;
  }
}
