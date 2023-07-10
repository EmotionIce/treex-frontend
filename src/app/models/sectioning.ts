import { Parent } from './parent';
import { Root } from './root';
import { Element } from './element';

export class Sectioning extends Parent {
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
