import { useEffect, useState } from 'react';
import { createId } from '../lib/id';
import { loadItemsWithMeta, saveItems } from '../lib/storage';
import type { FoodItem } from '../types/food';

type DraftFoodItem = Omit<FoodItem, 'id'>;

export function useFoodItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = loadItemsWithMeta();
    setItems(result.items);
    setError(result.error);
    setIsHydrating(false);
  }, []);

  function persist(nextItems: FoodItem[]) {
    setIsSaving(true);

    try {
      saveItems(nextItems);
      setItems(nextItems);
      setError(null);
      return true;
    } catch {
      setError('변경사항을 저장하지 못했습니다. 다시 시도해 주세요.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function addItem(item: DraftFoodItem) {
    return persist([{ ...item, id: createId() }, ...items]);
  }

  function updateItem(updatedItem: FoodItem) {
    return persist(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  }

  function deleteItem(id: string) {
    return persist(items.filter((item) => item.id !== id));
  }

  function clearError() {
    setError(null);
  }

  return {
    items,
    isHydrating,
    isSaving,
    error,
    addItem,
    updateItem,
    deleteItem,
    clearError,
  };
}
