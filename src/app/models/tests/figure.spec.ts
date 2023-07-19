import { Figure } from '../environments/figure';
import { Environment } from '../environment';
import { Caption } from '../caption';

describe('Figure', () => {
  let parent: Environment;
  let figure: Figure;

  beforeEach(() => {
    parent = new Environment('0', 'parent content', 'comment', 'summary', null);
    figure = new Figure('1', 'figure content', 'comment', 'summary', parent, 'path/to/file');
  });

  it('should create an instance', () => {
    expect(figure).toBeTruthy();
  });

  it('should inherit from Environment', () => {
    expect(figure).toBeInstanceOf(Environment);
  });

  it('should have the correct file location', () => {
    expect(figure.getFileLocation()).toBe('path/to/file');
  });

  it('should add caption correctly', () => {
    let caption: Caption = new Caption('the test caption');
    figure.addCaption(caption);
    expect(figure.getCaptions()).toContain(caption);
  });
});
