import { Figure } from '../environments/figure';
import { Environment } from '../environment';
import { Caption } from '../caption';
import { Parent } from '../parent'; // If you need to test Parent related functionalities

describe('Figure', () => {
  let parent: Environment;
  let figure: Figure;

  beforeEach(() => {
    parent = new Environment(
      '0',
      'type',
      'parent content',
      'comment',
      'summary',
      null
    );
    figure = new Figure(
      '1',
      'type',
      'figure content',
      'comment',
      'summary',
      parent,
      'path/to/file',
      'mimeType'
    );
  });

  it('should create an instance', () => {
    expect(figure).toBeTruthy();
  });

  it('should be an instance of Figure', () => {
    expect(figure).toBeInstanceOf(Figure);
  });

  it('should have the correct image location', () => {
    expect(figure.getImage()).toBe('path/to/file');
  });

  it('should add caption correctly', () => {
    let caption: Caption = new Caption('the test caption');
    figure.addCaption(caption);
    expect(figure.getCaptions()).toContain(caption);
  });

  it('should have the correct mime type', () => {
    expect(figure.getMimeType()).toBe('mimeType');
  });
});
