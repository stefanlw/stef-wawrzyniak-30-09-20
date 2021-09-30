import { formatValue } from '../utils';

describe('formatValue', () => {
  it('should correctly format a string to two decimal places', () => {
    expect(formatValue('1200')).toEqual('1,200.00');
    expect(formatValue('1200.59')).toEqual('1,200.59');
  });

  it('should correctly format a number to two decimal places', () => {
    expect(formatValue(1200)).toEqual('1,200.00');
    expect(formatValue(1200.59)).toEqual('1,200.59');
  });
});
