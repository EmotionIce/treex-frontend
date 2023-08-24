import { Sectioning } from '../sectioning';
import { Input } from '../input';
import { Root } from '../root';

describe('Sectioning', () => {
  let root: Root;
  let section1: Sectioning;
  let section2: Sectioning;

  beforeEach(() => {
    root = Root.createRoot();
    section1 = new Sectioning(
      '1',
      'Sectioning',
      'content1',
      'comment1',
      'summary1',
      root
    );
    root.addChild(section1);
    section2 = new Sectioning(
      '2',
      'Sectioning',
      'content2',
      'comment2',
      'summary2',
      section1
    );
  });

  it('should create an instance', () => {
    expect(section1).toBeTruthy();
  });

  it('should add child correctly', () => {
    expect(section1.addChild(section2)).toBe(true);
    expect(section1.getChildren().length).toBe(1);
  });
});
