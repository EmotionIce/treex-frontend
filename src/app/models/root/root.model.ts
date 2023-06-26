// root.ts

import { Element } from '../element/element.model';

export class Root {
  private static instance: Root;
  private elements: Element[] = [];

  private constructor() {}

  // Method to get the singleton instance
  public static getInstance(): Root {
    if (!Root.instance) {
      Root.instance = new Root();
    }

    return Root.instance;
  }

  // Method to add an element to the root
  public addElement(element: Element): void {
    this.elements.push(element);
  }

  // Method to find an element by ID
  public findElementById(id: string): Element | undefined {
    return this.elements.find((element) => element.id === id);
  }

  // Method to get all elements at a particular level
  public getElementsAtLevel(level: number): Element[] {
    // The level is determined by traversing up the parent chain
    return this.elements.filter((element) => {
      let currentLevel = 0;
      let currentElement: Element | undefined = element;

      while (currentElement && currentLevel < level) {
        currentElement = currentElement.parent;
        currentLevel++;
      }

      // If the parent chain ends exactly at the desired level,
      // this is an element at that level
      return currentElement !== undefined && currentLevel === level;
    });
  }
}
