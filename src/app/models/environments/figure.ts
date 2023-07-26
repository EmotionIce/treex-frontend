import { Environment } from '../environment';
import { Caption } from '../caption';
import { Parent } from '../parent';
import { Root } from '../root';

export class Figure extends Environment {
  private fileLocation: string;
  private captions: Caption[];

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null,
    fileLocation: string
  ) {
    super(id, content, comment, summary, parent);
    this.fileLocation = fileLocation;
    this.captions = [];
  }

  public getFileLocation(): string {
    return this.fileLocation;
  }

  public setFileLocation(fileLocation: string): void {
    this.fileLocation = fileLocation;
  }

  // Getters and setters for Captions
  getCaptions(): Caption[] {
    return this.captions;
  }

  addCaption(caption: Caption): void {
    this.captions.push(caption);
  }
}
