export interface LocalGetItem {
  getItem<T>(key: string): T | null;
}
export interface LocalRemoveItem {
  removeItem(key: string): boolean;
}

export interface LocalSaveItem {
  saveItem<T>(key: string, value: T): T;
}

export interface LocalClient
  extends LocalGetItem,
    LocalRemoveItem,
    LocalSaveItem {}
