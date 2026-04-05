import { describe, expect, it, vi } from 'vitest';
import { loadItems, loadItemsWithMeta, saveItems } from './storage';
import type { FoodItem } from '../types/food';

const sampleItems: FoodItem[] = [
  {
    id: '1',
    name: '계란',
    location: 'fridge',
    createdAt: '2026-04-05',
    quantity: '10개',
  },
];

function createMemoryStorage(initialValue?: string) {
  const store = new Map<string, string>();

  if (initialValue !== undefined) {
    store.set('fridge-manager-items', initialValue);
  }

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

describe('storage utilities', () => {
  it('saves and loads food items', () => {
    const storage = createMemoryStorage();

    saveItems(sampleItems, storage);

    expect(loadItems(storage)).toEqual(sampleItems);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it('recovers from malformed json by clearing the saved value', () => {
    const storage = createMemoryStorage('{not-json');

    const result = loadItemsWithMeta(storage);

    expect(result.items).toEqual([]);
    expect(result.error).toContain('초기화');
    expect(storage.removeItem).toHaveBeenCalledWith('fridge-manager-items');
  });

  it('recovers when the stored shape is invalid', () => {
    const storage = createMemoryStorage(JSON.stringify([{ name: '누락된 필드' }]));

    const result = loadItemsWithMeta(storage);

    expect(result.items).toEqual([]);
    expect(result.error).toContain('읽을 수 없어');
    expect(storage.removeItem).toHaveBeenCalledWith('fridge-manager-items');
  });

  it('propagates save failures', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error('quota exceeded');
      }),
      removeItem: vi.fn(),
    };

    expect(() => saveItems(sampleItems, storage)).toThrow('quota exceeded');
  });
});

