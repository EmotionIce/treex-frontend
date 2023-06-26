// formula.model.ts

import { Element } from '../element/element.model';
import { Child } from '../child/child';

export class Formula extends Element implements Child {
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
    console.log(`formula: ${this.content}`);
  }
}
