import { Element } from './element';
import { Root } from './root';

export class Label extends Element {
  constructor(
    id: string,
    type: string,
    content: string,
    comment: string,
    summary: string,
    parent: Element | Root | null = null
  ) {
    super(id, type, content, comment, summary, parent);
  }
}
