import { PersistanceBuilder } from '../persistance';
import { buildWebstorage } from '../webstorage/webstorage';

export function createSessionStoragePersistance<T>(key: string): PersistanceBuilder<T> {
  return (initialValue: T) => buildWebstorage({
    initialValue,
    key,
    storage: sessionStorage,
  });
}
