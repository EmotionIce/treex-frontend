import { Child } from '../child';
import { Root } from '../root';

describe('Child', () => {
  let child: Child;
  let parent: Root;

  beforeEach(() => {
    parent = Root.createRoot();
    child = new Child('1', 'content', 'comment', 'summary', parent);
  });

  it('should create an instance', () => {
    expect(child).toBeTruthy();
  });

  it('should have the correct id', () => {
    expect(child.getId()).toEqual('1');
  });

  it('should have the correct content', () => {
    expect(child.getContent()).toEqual('content');
  });

  it('should have the correct comment', () => {
    expect(child.getComment()).toEqual('comment');
  });

  it('should have the correct summary', () => {
    expect(child.getSummary()).toEqual('summary');
  });

  it('should have the correct parent', () => {
    expect(child.getParent()).toBe(parent);
  });

  it('should update content correctly', () => {
    child.setContent('new content');
    expect(child.getContent()).toEqual('new content');
  });

  it('should update comment correctly', () => {
    child.setComment('new comment');
    expect(child.getComment()).toEqual('new comment');
  });

  it('should update summary correctly', () => {
    child.setSummary('new summary');
    expect(child.getSummary()).toEqual('new summary');
  });

  it('should update parent correctly', () => {
    const newParent = Root.createRoot();
    child.changeParent(newParent);
    expect(child.getParent()).toBe(newParent);
  });
});
