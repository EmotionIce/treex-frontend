// text.model.ts

import { Element } from '../element/element.model';
import { Child } from '../child/child';

export class Text extends Element implements Child {
  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent?: Element
  ) {
    super(id, content, comment, summary, parent);
  }

  display(): void {
    // Implementation of display method
    console.log(`Text: ${this.content}`);
  }
}
