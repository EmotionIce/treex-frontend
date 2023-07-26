import { Environment } from '../environment';
import { Root } from '../root';
import { Caption } from '../caption';
import { Label } from '../label';

describe('Environment', () => {
  let environment: Environment;
  let root: Root;
  let caption: Caption;
  let label: Label;

  beforeEach(() => {
    root = Root.createRoot();
    caption = new Caption('Caption text');
    environment = new Environment('1', 'content', 'comment', 'summary', root);
  });

  it('should create an instance', () => {
    expect(environment).toBeTruthy();
  });
});
