// element.model.ts

export abstract class Element {
  constructor(
    public id: string,
    public content: string,
    public comment: string,
    public summary: string,
    public parent?: Element | undefined
  ) {}

  // Method to change the parent of the element
  changeParent(newParent: Element | undefined): void {
    this.parent = newParent;
  }
}
