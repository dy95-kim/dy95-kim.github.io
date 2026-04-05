import type { FoodItem } from '../types/food';

const STORAGE_KEY = 'fridge-manager-items';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface LoadItemsResult {
  items: FoodItem[];
  error: string | null;
}

function resolveStorage(storage?: StorageLike): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (
    typeof globalThis !== 'undefined' &&
    'localStorage' in globalThis &&
    globalThis.localStorage
  ) {
    return globalThis.localStorage;
  }

  return null;
}

function isFoodItem(value: unknown): value is FoodItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    (candidate.location === 'fridge' || candidate.location === 'freezer') &&
    typeof candidate.createdAt === 'string' &&
    (candidate.expiresAt === undefined || typeof candidate.expiresAt === 'string') &&
    (candidate.quantity === undefined || typeof candidate.quantity === 'string') &&
    (candidate.memo === undefined || typeof candidate.memo === 'string')
  );
}

function isFoodItemArray(value: unknown): value is FoodItem[] {
  return Array.isArray(value) && value.every(isFoodItem);
}

export function loadItemsWithMeta(storage?: StorageLike): LoadItemsResult {
  const target = resolveStorage(storage);

  if (!target) {
    return {
      items: [],
      error: '이 브라우저에서는 로컬 저장소를 사용할 수 없어 데이터가 유지되지 않을 수 있습니다.',
    };
  }

  const rawValue = target.getItem(STORAGE_KEY);

  if (!rawValue) {
    return { items: [], error: null };
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!isFoodItemArray(parsed)) {
      target.removeItem(STORAGE_KEY);

      return {
        items: [],
        error: '저장된 데이터를 읽을 수 없어 초기화했습니다.',
      };
    }

    return { items: parsed, error: null };
  } catch {
    target.removeItem(STORAGE_KEY);

    return {
      items: [],
      error: '저장된 데이터를 복구하는 동안 초기화했습니다.',
    };
  }
}

export function loadItems(storage?: StorageLike): FoodItem[] {
  return loadItemsWithMeta(storage).items;
}

export function saveItems(items: FoodItem[], storage?: StorageLike): void {
  const target = resolveStorage(storage);

  if (!target) {
    throw new Error('localStorage is not available');
  }

  target.setItem(STORAGE_KEY, JSON.stringify(items));
}

