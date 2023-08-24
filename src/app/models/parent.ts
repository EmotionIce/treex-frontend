import { Element } from './element';
import { Root } from './root';

export abstract class Parent extends Element {
  private children: Element[];

  constructor(
    id: string,
    type: string,
    content: string,
    comment: string,
    summary: string,
    parent: Element | Root | null = null
  ) {
    super(id, type, content, comment, summary, parent);
    this.children = [];
  }

  public addChild(child: Element): boolean {
    this.children.push(child);
    return true;
  }

  /**
   * Removes a child from the children list
   *
   * @param childId id of the child to be removed
   * @returns true if the child was found and removed, false if not
   */
  public removeChild(childId: string): boolean {
    const index = this.children.findIndex((child) => child.getId() === childId);
    if (index > -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Return the previous sibling of the given element or null if it is the first element
   *
   * @param e Element whose previous sibling is to be found
   * @returns
   */
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
