import { Parent } from './parent';
import { Root } from './root';

export class Input extends Parent {
  constructor(
    id: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null
  ) {
    super(id, content, comment, summary, parent);
  }
}
