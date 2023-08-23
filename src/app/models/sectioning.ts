import { Parent } from './parent';
import { Root } from './root';
import { Element } from './element';

export class Sectioning extends Parent {
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
