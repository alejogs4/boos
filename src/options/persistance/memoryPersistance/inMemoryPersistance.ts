import { PersistanceBuilder } from '../persistance';

export function buildInMemoryPersistance<T>(): PersistanceBuilder<T> {
  return (initialValue: T) => ({
    getItem() {
      return initialValue;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(_value: T) {},
    existItem() {
      return true;
    },
  });
}
