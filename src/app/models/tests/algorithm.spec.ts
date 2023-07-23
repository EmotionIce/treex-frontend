import { Algorithm } from '../environments/algorithm';
import { Environment } from '../environment';

describe('Algorithm', () => {
  let parent: Environment;
  let algorithm: Algorithm;

  beforeEach(() => {
    parent = new Environment('0', 'parent content', 'comment', 'summary', null);
    algorithm = new Algorithm(
      '1',
      'algorithm content',
      'comment',
      'summary',
      parent
    );
  });

  it('should create an instance', () => {
    expect(algorithm).toBeTruthy();
  });

  it('should inherit from Environment', () => {
    expect(algorithm).toBeInstanceOf(Environment);
  });
});
