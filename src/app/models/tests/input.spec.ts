import { Input } from '../input';
import { Root } from '../root';

describe('Input', () => {
  let root: Root;
  let input: Input;

  beforeEach(() => {
    root = Root.createRoot();
    input = new Input('1', 'type', 'content', 'comment', 'summary', root);
  });

  it('should create an instance', () => {
    expect(input).toBeTruthy();
  });

  it('should correctly get and set content', () => {
    expect(input.getContent()).toBe('content');
    input.setContent('newContent');
    expect(input.getContent()).toBe('newContent');
  });

  it('should correctly get and set comment', () => {
    expect(input.getComment()).toBe('comment');
    input.setComment('newComment');
    expect(input.getComment()).toBe('newComment');
  });

  it('should correctly get and set summary', () => {
    expect(input.getSummary()).toBe('summary');
    input.setSummary('newSummary');
    expect(input.getSummary()).toBe('newSummary');
  });

  it('should correctly get parent', () => {
    expect(input.getParent()).toBe(root);
  });

  it('should add and remove child elements', () => {
    const child = new Input(
      '2',
      'childType',
      'childContent',
      'childComment',
      'childSummary',
      input
    );
    input.addChild(child);
    expect(input.getChildren().length).toBe(1);
    expect(input.removeChild('2')).toBeTruthy();
    expect(input.getChildren().length).toBe(0);
  });

  // Add more tests as necessary
});
