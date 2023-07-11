import { Element } from '../element';
import { Root } from '../root';

class TestElement extends Element {}

describe('Element', () => {
  let element: TestElement;
  let parent: Root;

  beforeEach(() => {
    parent = Root.createRoot();
    element = new TestElement('1', 'content', 'comment', 'summary', parent);
  });

  it('should create an instance', () => {
    expect(element).toBeTruthy();
  });

  it('should have the correct id', () => {
    expect(element.getId()).toEqual('1');
  });

  it('should have the correct content', () => {
    expect(element.getContent()).toEqual('content');
  });

  it('should have the correct comment', () => {
    expect(element.getComment()).toEqual('comment');
  });

  it('should have the correct summary', () => {
    expect(element.getSummary()).toEqual('summary');
  });

  it('should have the correct parent', () => {
    expect(element.getParent()).toBe(parent);
  });

  it('should update content correctly', () => {
    element.setContent('new content');
    expect(element.getContent()).toEqual('new content');
  });

  it('should update comment correctly', () => {
    element.setComment('new comment');
    expect(element.getComment()).toEqual('new comment');
  });

  it('should update summary correctly', () => {
    element.setSummary('new summary');
    expect(element.getSummary()).toEqual('new summary');
  });

  it('should update parent correctly', () => {
    const newParent = Root.createRoot();
    element.changeParent(newParent);
    expect(element.getParent()).toBe(newParent);
  });
});
