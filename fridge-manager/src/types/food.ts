export type StorageLocation = 'fridge' | 'freezer';

export type SortOption = 'expiry' | 'recent';

export type FoodStatus = 'fresh' | 'warning' | 'expired' | 'no-expiry';

export interface FoodItem {
  id: string;
  name: string;
  location: StorageLocation;
  createdAt: string;
  expiresAt?: string;
  quantity?: string;
  memo?: string;
}

export interface FoodFormValues {
  name: string;
  location: StorageLocation;
  createdAt: string;
  expiresAt: string;
  quantity: string;
  memo: string;
}

