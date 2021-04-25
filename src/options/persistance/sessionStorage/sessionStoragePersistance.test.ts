import { createSessionStoragePersistance } from './sessionstoragePersistance';

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

describe('localstoragePersistance tests', () => {
  test('Should save in localstorage a given key', () => {
    const sessionStorageKey = 'key-a';

    const sessionStoragePersistance = createSessionStoragePersistance(sessionStorageKey)(2);
    sessionStoragePersistance.getItem();

    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(sessionStorageKey);
    expect(window.sessionStorage.getItem).toHaveBeenCalledTimes(1);

    sessionStoragePersistance.setItem(3);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(sessionStorageKey, '3');
    expect(window.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
