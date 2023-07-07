import { Parent } from './parent';

export abstract class Element {
  private id: string;
  private content: string;
  private comment: string;
  private summary: string;
  private parent: Element | null;

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Element | null = null
  ) {
    this.id = id;
    this.content = content;
    this.comment = comment;
    this.summary = summary;
    this.parent = parent;
  }

  public getId(): string {
    return this.id;
  }

  public getContent(): string {
    return this.content;
  }

  public getComment(): string {
    return this.comment;
  }

  public getSummary(): string {
    return this.summary;
  }

  public getParent(): Element | null {
    return this.parent;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public setComment(comment: string): void {
    this.comment = comment;
  }

  public setSummary(summary: string): void {
    this.summary = summary;
  }

  public changeParent(newParent: Parent): boolean {
    if (newParent instanceof Element) {
      this.parent = newParent;
      return true;
    }
    return false;
  }

  // This method is optional and will be overridden in the Parent subclass
  getChildren?(): Element[];
}
