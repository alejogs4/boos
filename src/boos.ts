export type Subscriber<T> = (value: T) => void;

export type ValueModifier<T> = (value: T) => void;

export interface Boos<T> {
  subscribe: (subscriber: Subscriber<T>) => void;
  unsubscribe: (subscriber: Subscriber<T>) => void;
  modifyValue: (modifier: ValueModifier<T>) => T;
  getValue: () => T;
}
