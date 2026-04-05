import { describe, expect, it } from 'vitest';
import { getDaysBetween, isValidDateInput, toDateValue } from './date';

describe('date utils', () => {
  it('validates yyyy-mm-dd strings correctly', () => {
    expect(isValidDateInput('2024-02-29')).toBe(true);
    expect(isValidDateInput('2026-02-29')).toBe(false);
    expect(isValidDateInput('2026/04/05')).toBe(false);
  });

  it('converts dates to comparable numeric values', () => {
    expect(toDateValue('2026-04-05')).toBeTypeOf('number');
    expect(toDateValue('2026-13-01')).toBeNull();
  });

  it('calculates day differences at date granularity', () => {
    expect(getDaysBetween('2026-04-05', '2026-04-05')).toBe(0);
    expect(getDaysBetween('2026-04-05', '2026-04-08')).toBe(3);
    expect(getDaysBetween('2026-04-05', '2026-04-01')).toBe(-4);
  });
});

