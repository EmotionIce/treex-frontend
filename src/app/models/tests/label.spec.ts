import { Label } from '../label';
import { Environment } from '../environment';

describe('Label', () => {
  let label: Label;

  beforeEach(() => {
    label = new Label('1', 'content', 'comment', 'summary', new Environment('0', 'content', 'comment', 'summary', null));
  });

  it('should create an instance', () => {
    expect(label).toBeTruthy();
  });

  it('should correctly set ID during construction', () => {
    expect(label.getId()).toEqual('1');
  });

  it('should correctly set content during construction', () => {
    expect(label.getContent()).toEqual('content');
  });

  it('should correctly set comment during construction', () => {
    expect(label.getComment()).toEqual('comment');
  });

  it('should correctly set summary during construction', () => {
    expect(label.getSummary()).toEqual('summary');
  });

  it('should correctly set parent during construction', () => {
    expect(label.getParent()).toBeInstanceOf(Environment);

    const parent = label.getParent();
    expect(parent).toBeInstanceOf(Environment);

    if(parent instanceof Environment) {
    expect(parent.getId()).toEqual('0');
    }
  });
});
