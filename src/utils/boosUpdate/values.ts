/* eslint-disable no-use-before-define */
import { ObjectsCache } from './objectsCache';

function areSameObjects<T extends object>(objectA: T, objectB: T, cache: ObjectsCache<T>): boolean {
  const objectAKeys = Object.keys(objectA);
  const objectBKeys = Object.keys(objectB);

  if (!areSameArrays(objectAKeys, objectBKeys, new ObjectsCache([]))) return false;
  // way to determine cyclic objects, assuming they are equal
  if (cache.get(objectA) && cache.get(objectB)) {
    return objectA === objectB;
  }

  cache.add(objectA);
  cache.add(objectB);
  let result = true;

  for (let i = 0; i < objectAKeys.length; i += 1) {
    const aKey = objectAKeys[i];
    const valueForAKey = objectA[aKey as keyof T];
    const valueForBKey = objectB[aKey as keyof T];

    if (typeof valueForAKey !== typeof valueForBKey) {
      result = false;
      break;
    }

    if (typeof valueForAKey !== 'object' && valueForAKey !== valueForBKey) {
      result = false;
      break;
    }

    if (Array.isArray(valueForAKey) && Array.isArray(valueForBKey)) {
      if (!areSameArrays(valueForAKey, valueForBKey, cache)) {
        result = false;
        break;
      }
    }

    if (typeof valueForAKey === 'object') {
      if (!areSameObjects(Object(valueForAKey), valueForBKey, cache)) {
        result = false;
        break;
      }
    }
  }

  cache.remove(objectA);
  cache.remove(objectB);
  return result;
}

function areSameArrays<T>(arrayA: Array<T>, arrayB: Array<T>, cache: ObjectsCache<T>): boolean {
  if (arrayA.length !== arrayB.length) return false;

  return arrayA.every((elementA, index) => {
    if (typeof elementA !== typeof arrayB[index]) return false;
    if (typeof elementA !== 'object') {
      return arrayB[index] === elementA;
    }

    return areSameObjects(Object(elementA), arrayB[index], cache);
  });
}

export function doesNeedToChange(oldValue: unknown, newValue: unknown): boolean {
  // If both results are the same reference so there is not need for change
  if (oldValue === newValue) return false;

  // If you have two results of different types changes is necessary
  if (typeof oldValue !== typeof newValue) return true;

  // Different primitives values needs change
  if (typeof oldValue !== 'object') {
    return oldValue !== newValue;
  }

  const cache = new ObjectsCache([]);

  // Differents arrays needs change
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    return !areSameArrays(oldValue, newValue, cache);
  }

  // Differents objects needs change
  if (typeof oldValue === 'object' && typeof newValue === 'object') {
    return !areSameObjects(Object(oldValue), newValue, cache);
  }

  // Any other possible scenario will no handle yet so it should change
  return true;
}
