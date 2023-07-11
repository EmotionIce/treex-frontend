import { Parent } from './parent';
import { Root } from './root';

export class Input extends Parent {
  private fileName: string;

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null,
    fileName: string
  ) {
    super(id, content, comment, summary, parent);
    this.fileName = fileName;
  }

  getFileName(): string {
    return this.fileName;
  }

  setFileName(fileName: string): void {
    this.fileName = fileName;
  }
}
