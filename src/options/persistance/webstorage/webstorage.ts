import { Persistance } from '../persistance';

interface WebstorageParameters<T> {
  key: string;
  storage: Storage;
  initialValue: T;
}

export function buildWebstorage<T>({
  storage,
  initialValue,
  key,
}: WebstorageParameters<T>): Persistance<T> {
  return {
    getItem() {
      const storedValue = storage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    },
    setItem(value: T) {
      storage.setItem(key, JSON.stringify(value));
    },
    existItem() {
      const storedValue = storage.getItem(key);
      return storedValue !== null && storedValue !== undefined;
    },
  };
}
