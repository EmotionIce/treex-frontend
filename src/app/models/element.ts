import { Parent } from './parent';
import { Root } from './root';

export abstract class Element {
  private id: string;
  private content: string;
  private comment: string;
  private summary: string;
  private parent: Element | Root | null;

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Element | Root | null = null
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

  public getParent(): Element | Root | null {
    return this.parent;
  }

  public setId(id: string): void {
    this.id = id;
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

  public changeParent(newParent: Root | Parent): void {
    this.parent = newParent;
  }

  // This method is optional and will be overridden in the Parent subclass
  getChildren?(): Element[];
}
