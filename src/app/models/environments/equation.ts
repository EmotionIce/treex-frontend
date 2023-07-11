import { Environment } from '../environment';

export class Equation extends Environment {
    constructor(
      id: string,
      content: string,
      comment: string,
      summary: string,
      parent: Environment
    ) {
      super(id, content, comment, summary, parent);
    }
  }