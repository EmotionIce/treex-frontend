import { Element } from './element';
import { Root } from './root';

export class Child extends Element {
  // Inherits id, content, comment, summary, and parent from Element class
  // Inherits changeParent method from Element class

  // We don't need to define a constructor here unless there are additional properties
  // that the Child class needs to initialize. If that's the case, we can define a
  // constructor and call super() to call the constructor of the Element class.

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
