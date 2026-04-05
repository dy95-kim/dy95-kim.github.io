import { formatDate, getDaysBetween, toDateValue } from './date';
import type { FoodItem, FoodStatus, SortOption } from '../types/food';

export function getDaysRemaining(
  expiresAt?: string,
  today = formatDate(),
): number | null {
  if (!expiresAt) {
    return null;
  }

  return getDaysBetween(today, expiresAt);
}

export function getFoodStatus(
  item: Pick<FoodItem, 'expiresAt'>,
  today = formatDate(),
): FoodStatus {
  const daysRemaining = getDaysRemaining(item.expiresAt, today);

  if (daysRemaining === null) {
    return 'no-expiry';
  }

  if (daysRemaining < 0) {
    return 'expired';
  }

  if (daysRemaining <= 3) {
    return 'warning';
  }

  return 'fresh';
}

export function filterAndSortItems(
  items: FoodItem[],
  search: string,
  sort: SortOption,
): FoodItem[] {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredItems = normalizedSearch
    ? items.filter((item) =>
        item.name.toLocaleLowerCase().includes(normalizedSearch),
      )
    : items;

  return [...filteredItems].sort((left, right) => {
    if (sort === 'recent') {
      const createdDiff =
        (toDateValue(right.createdAt) ?? 0) - (toDateValue(left.createdAt) ?? 0);

      if (createdDiff !== 0) {
        return createdDiff;
      }

      return left.name.localeCompare(right.name, 'ko');
    }

    const leftExpiry = left.expiresAt ? toDateValue(left.expiresAt) : null;
    const rightExpiry = right.expiresAt ? toDateValue(right.expiresAt) : null;

    if (leftExpiry === null && rightExpiry === null) {
      return left.name.localeCompare(right.name, 'ko');
    }

    if (leftExpiry === null) {
      return 1;
    }

    if (rightExpiry === null) {
      return -1;
    }

    const expiryDiff = leftExpiry - rightExpiry;

    if (expiryDiff !== 0) {
      return expiryDiff;
    }

    return left.name.localeCompare(right.name, 'ko');
  });
}

