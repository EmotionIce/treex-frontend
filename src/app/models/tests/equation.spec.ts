import { Equation } from '../environments/equation';
import { Environment } from '../environment';

describe('Equation', () => {
  let parent: Environment;
  let equation: Equation;

  beforeEach(() => {
    parent = new Environment('0', 'parent content', 'comment', 'summary', null);
    equation = new Equation('1', 'equation content', 'comment', 'summary', parent);
  });

  it('should create an instance', () => {
    expect(equation).toBeTruthy();
  });

  it('should inherit from Environment', () => {
    expect(equation).toBeInstanceOf(Environment);
  });
});
