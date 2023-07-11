import { Parent } from './parent';
import { Caption } from './caption';
import { Label } from './label';
import { Root } from './root';

export class Environment extends Parent {
  // Store Caption and Label instances
  private captions: Caption[];
  private labels: Label[];

  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null
  ) {
    super(id, content, comment, summary, parent);
    this.captions = [];
    this.labels = [];
  }

  // Getters and setters
  getCaptions(): Caption[] {
    return this.captions;
  }

  addCaption(caption: Caption): void {
    this.captions.push(caption);
  }

  getLabels(): Label[] {
    return this.labels;
  }

  addLabel(label: Label): void {
    this.labels.push(label);
  }
}
