import { Parent } from './parent';
import { Root } from './root';

export class Environment extends Parent {
  constructor(
    id: string,
    type: string,
    content: string,
    comment: string,
    summary: string,
    parent: Parent | Root | null = null
  ) {
    super(id, type, content, comment, summary, parent);
  }
}
