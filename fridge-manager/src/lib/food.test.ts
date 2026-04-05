import { describe, expect, it } from 'vitest';
import { filterAndSortItems, getDaysRemaining, getFoodStatus } from './food';
import type { FoodItem } from '../types/food';

const items: [FoodItem, FoodItem, FoodItem, FoodItem] = [
  {
    id: 'kimchi',
    name: '김치',
    location: 'fridge',
    createdAt: '2026-04-04',
    expiresAt: '2026-04-10',
  },
  {
    id: 'mandu',
    name: '만두',
    location: 'freezer',
    createdAt: '2026-04-05',
    expiresAt: '2026-04-07',
  },
  {
    id: 'milk',
    name: '우유',
    location: 'fridge',
    createdAt: '2026-04-01',
    expiresAt: '2026-04-04',
  },
  {
    id: 'sauce',
    name: '소스',
    location: 'fridge',
    createdAt: '2026-04-03',
  },
];

describe('food status utilities', () => {
  it('calculates remaining days when expiry exists', () => {
    expect(getDaysRemaining('2026-04-05', '2026-04-05')).toBe(0);
    expect(getDaysRemaining('2026-04-07', '2026-04-05')).toBe(2);
    expect(getDaysRemaining(undefined, '2026-04-05')).toBeNull();
  });

  it('classifies expired, warning, fresh, and no-expiry states', () => {
    expect(getFoodStatus(items[2], '2026-04-05')).toBe('expired');
    expect(getFoodStatus(items[1], '2026-04-05')).toBe('warning');
    expect(getFoodStatus(items[0], '2026-04-05')).toBe('fresh');
    expect(getFoodStatus(items[3], '2026-04-05')).toBe('no-expiry');
  });
});

describe('food filtering and sorting', () => {
  it('filters by food name case-insensitively', () => {
    expect(filterAndSortItems(items, '우', 'expiry').map((item) => item.name)).toEqual([
      '우유',
    ]);
  });

  it('sorts by earliest expiry and keeps no-expiry items at the end', () => {
    expect(filterAndSortItems(items, '', 'expiry').map((item) => item.name)).toEqual([
      '우유',
      '만두',
      '김치',
      '소스',
    ]);
  });

  it('sorts by most recently created items first', () => {
    expect(filterAndSortItems(items, '', 'recent').map((item) => item.name)).toEqual([
      '만두',
      '김치',
      '소스',
      '우유',
    ]);
  });
});
