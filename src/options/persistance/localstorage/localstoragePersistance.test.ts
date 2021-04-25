import { createLocalStoragePersistance } from './localstoragePersistance';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

describe('localstoragePersistance tests', () => {
  test('Should save in localstorage a given key', () => {
    const localStorageKey = 'key-a';

    const localstoragePersistance = createLocalStoragePersistance(localStorageKey)(2);
    localstoragePersistance.getItem();

    expect(window.localStorage.getItem).toHaveBeenCalledWith(localStorageKey);
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);

    localstoragePersistance.setItem(3);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(localStorageKey, '3');
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
