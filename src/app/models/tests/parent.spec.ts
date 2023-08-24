import { Child } from '../child';
import { Root } from '../root';
import { Parent } from '../parent';

class TestParent extends Parent {}

describe('Parent', () => {
  let parent: TestParent;
  let root: Root;

  beforeEach(() => {
    root = Root.createRoot();
    parent = new TestParent('1', 'type', 'content', 'comment', 'summary', root);
  });

  it('should create an instance', () => {
    expect(parent).toBeTruthy();
  });

  // Here we test the addChild and getChildren methods
  it('should add child correctly', () => {
    const child = new Child(
      '2',
      'type',
      'content',
      'comment',
      'summary',
      parent
    );
    parent.addChild(child);
    expect(parent.getChildren()).toContain(child);
  });

  // Test removeChild method
  it('should remove child correctly', () => {
    const child = new Child(
      '2',
      'type',
      'content',
      'comment',
      'summary',
      parent
    );
    parent.addChild(child);
    expect(parent.removeChild(child.getId())).toBe(true);
    expect(parent.getChildren()).not.toContain(child);
  });

  // Test getPrevious method
  it('should get previous child correctly', () => {
    const child1 = new Child(
      '2',
      'type',
      'content',
      'comment',
      'summary',
      parent
    );
    const child2 = new Child(
      '3',
      'type',
      'content',
      'comment',
      'summary',
      parent
    );
    parent.addChild(child1);
    parent.addChild(child2);
    expect(parent.getPrevious(child2)).toBe(child1);
  });
});
