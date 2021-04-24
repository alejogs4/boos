export interface Persistance<T> {
  getItem: () => T;
  setItem: (value: T) => void;
  existItem: () => boolean;
}

export type PersistanceBuilder<T> = (initialValue: T) => Persistance<T>;
