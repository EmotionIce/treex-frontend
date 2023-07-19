import { Child } from './child';
import { Element } from './element';
import { Root } from './root';

export class Label extends Element {

    constructor(
      id: string,
      content: string,
      comment: string,
      summary: string,
      parent: Element | Root | null = null
    ) {
        super(id, content, comment, summary, parent);
    }
}
