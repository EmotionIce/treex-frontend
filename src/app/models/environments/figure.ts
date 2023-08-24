import { Environment } from '../environment';
import { Caption } from '../caption';
import { Parent } from '../parent';
import { Root } from '../root';

export class Figure extends Environment {
  private image: string;
  private captions: Caption[];
  private mimeType: string;

  constructor(
    id: string,
    type: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null,
    image: string,
    mimeType: string
  ) {
    super(id, type, content, comment, summary, parent);
    this.image = image;
    this.captions = [];
    this.mimeType = mimeType;
  }

  // Getter for image
  public getImage(): string {
    return this.image;
  }

  // Setter for image
  public setImage(image: string): void {
    this.image = image;
  }

  getCaptions(): Caption[] {
    return this.captions;
  }

  addCaption(caption: Caption): void {
    this.captions.push(caption);
  }

  public getMimeType(): string {
    return this.mimeType;
  }
}
