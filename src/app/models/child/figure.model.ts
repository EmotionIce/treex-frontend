// figure.model.ts

import { Element } from '../element/element.model';
import { Child } from './child';

export class Figure extends Element implements Child {
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
    console.log(`Figure: ${this.content}`);
  }
}
