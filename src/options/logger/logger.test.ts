import { logValueChanges } from './logger';

afterEach(() => {
  jest.clearAllMocks();
});

describe('logger methods', () => {
  test('Should call console grouping methods properly', () => {
    const groupSpy = jest.spyOn(global.console, 'group');
    const groupEndSpy = jest.spyOn(global.console, 'groupEnd');
    const groupLogSpy = jest.spyOn(global.console, 'log');

    logValueChanges({ active: true, tag: 'counter' }, 1, 2);

    expect(groupSpy).toHaveBeenCalledTimes(2);
    expect(groupEndSpy).toHaveBeenCalledTimes(2);
    expect(groupLogSpy).toHaveBeenCalledTimes(2);
  });

  test('Should call console grouping methods properly only if active returns true', () => {
    const groupSpy = jest.spyOn(global.console, 'group');
    const groupEndSpy = jest.spyOn(global.console, 'groupEnd');
    const groupLogSpy = jest.spyOn(global.console, 'log');

    logValueChanges({ active: () => false, tag: 'counter' }, 1, 2);

    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).not.toHaveBeenCalled();
    expect(groupLogSpy).not.toHaveBeenCalled();

    logValueChanges({ active: (oldValue) => oldValue === 1, tag: 'counter' }, 1, 2);

    expect(groupSpy).toHaveBeenCalledTimes(2);
    expect(groupEndSpy).toHaveBeenCalledTimes(2);
    expect(groupLogSpy).toHaveBeenCalledTimes(2);
  });

  test('Should not call grouping methods if no options were provided or active is false', () => {
    const groupSpy = jest.spyOn(global.console, 'group');
    const groupEndSpy = jest.spyOn(global.console, 'groupEnd');
    const groupLogSpy = jest.spyOn(global.console, 'log');

    logValueChanges(undefined, 1, 2);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).not.toHaveBeenCalled();
    expect(groupLogSpy).not.toHaveBeenCalled();

    logValueChanges({ active: false, tag: 'tag' }, 1, 2);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).not.toHaveBeenCalled();
    expect(groupLogSpy).not.toHaveBeenCalled();
  });
});
