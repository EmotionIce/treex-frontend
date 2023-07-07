import { Root } from '../root';
import { Child } from '../child';

describe('Root', () => {
  let root: Root;
  let child1: Child;
  let child2: Child;

  beforeEach(() => {
    root = Root.createRoot();
    child1 = new Child('1', 'content', 'comment', 'summary', root);
    child2 = new Child('2', 'content', 'comment', 'summary', root);
    root.addChild(child1);
    root.addChild(child2);
    child1.changeParent(root);
    child2.changeParent(root);
  });

  it('should create an instance', () => {
    expect(root).toBeTruthy();
  });

  it('should always return the same instance', () => {
    const anotherRoot = Root.createRoot();
    expect(anotherRoot).toBe(root);
  });

  it('should correctly search by ID', () => {
    expect(root.searchByID('1')).toBeDefined();
    expect(root.searchByID('2')).toBeDefined();

    expect(root.searchByID('1')!.getId()).toBe('1');
    expect(root.searchByID('2')!.getId()).toBe('2');
    expect(root.searchByID('3')).toBeNull();
  });

  it('should correctly get elements of layer', () => {
    // Assuming that root is considered to be at layer 0
    // and its immediate children are considered to be at layer 1
    expect(root.getElementsOfLayer(child1)).toContain(child1, child2);
  });

  it('should correctly get depth', () => {
    // Assuming that root is considered to be at depth 0
    // and its immediate children are considered to be at depth 1
    expect((root as any).getDepth(child1)).toEqual(1);
  });
});
