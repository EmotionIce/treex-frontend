import { Element } from './element';
import { Parent } from './parent';

export class Root {
  private static instance: Root;
  private children: Element[] = [];

  private constructor() {}

  public static createRoot(): Root {
    if (!Root.instance) {
      Root.instance = new Root();
    }
    return Root.instance;
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

  public searchByID(id: string): Element | null {
    // Initialize a queue with the children of the root
    let queue: Element[] = [...this.children];

    // While there are elements in the queue...
    while (queue.length > 0) {
      let currentElement = queue.shift()!;
      if (currentElement === undefined) return null;
      // If the current element has the target id, return it
      if (currentElement.getId() === id) {
        return currentElement;
      }

      // If the currentElement is a Parent, add its children to the queue
      if (currentElement instanceof Parent) {
        let children = (currentElement as Parent).getChildren();
        queue.push(...children);
      }
    }

    // If no element with the target id is found, return null
    return null;
  }

  /*
   * Returns an array of all elements in the root that are on the same layer as the target element
   */
  public getElementsOfLayer(e: Element): Element[] {
    // Initialize result array
    let result: Element[] = [];

    // Compute the depth of the target element
    let targetDepth = this.getDepth(e);

    // Helper function for depth-first traversal
    let traverse = (node: Element, depth: number) => {
      if (depth === targetDepth) {
        result.push(node);
      } else if (node instanceof Parent) {
        for (let child of node.getChildren()) {
          traverse(child, depth + 1);
        }
      }
    };

    // Start the traversal from every child of the root
    for (let child of this.children) {
      traverse(child, 1);
    }

    // Return the result
    return result;
  }

  private getDepth(e: Element | Root | null): number {
    let depth = 0;

    if (e === null || e === this) return depth;

    while (e !== this) {
      if (e instanceof Element) {
        depth++;
        e = e.getParent();
      } else {
        break;
      }
    }
    return depth;
  }

  // Returns the root's children
  public getChildren(): Element[] {
    return this.children;
  }

  public clear(): void {
    this.children = [];
  }
}
