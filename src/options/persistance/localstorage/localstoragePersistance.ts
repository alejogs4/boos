import { PersistanceBuilder } from '../persistance';
import { buildWebstorage } from '../webstorage/webstorage';

export function createLocalStoragePersistance<T>(key: string): PersistanceBuilder<T> {
  return (initialValue: T) =>
    buildWebstorage({
      initialValue,
      key,
      storage: localStorage,
    });
}
