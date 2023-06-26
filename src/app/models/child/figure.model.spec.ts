import { Figure } from './figure.model';

describe('Figure', () => {
  it('should create an instance', () => {
    expect(new Figure('', '', '', '')).toBeTruthy();
  });
});
