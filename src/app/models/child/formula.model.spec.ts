import { Formula } from './formula.model';

describe('Formula', () => {
  it('should create an instance', () => {
    expect(new Formula('', '', '', '')).toBeTruthy();
  });
});
