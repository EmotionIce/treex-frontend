import { Child } from '../child';
import { Root } from '../root';

describe('Child', () => {
  let child: Child;
  let parent: Root;

  beforeEach(() => {
    parent = Root.createRoot();
    child = new Child('1', 'type', 'content', 'comment', 'summary', parent);
  });

  it('should create an instance', () => {
    expect(child).toBeTruthy();
  });
});
