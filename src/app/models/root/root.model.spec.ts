import { Root } from './root.model';

describe('Root', () => {
  it('should create an instance', () => {
    expect(Root.getInstance()).toBeTruthy();
  });
});
