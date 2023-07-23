import { Environment } from '../environment';
import { Parent } from '../parent';
import { Root } from '../root';

export class Algorithm extends Environment {
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
