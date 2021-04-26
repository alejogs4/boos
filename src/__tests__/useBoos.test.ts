import { act, renderHook } from '@testing-library/react-hooks';
import createBoos from '../createBoos';
import useBoos from '../useBoos';

describe('useBoos tests', () => {
  test('Should return boos information and its modifier function', () => {
    const initialValue = { counter: 0 };
    const boos = createBoos({ initialValue });
    const {
      result: {
        current: [counter, modifier],
      },
    } = renderHook(() => useBoos(boos));

    expect(counter).toEqual(initialValue);
    expect(modifier).toBeInstanceOf(Function);
  });

  test('Should update returned value over time as modifier function is executed', () => {
    const initialValue = { counter: 0 };
    const boos = createBoos({ initialValue });
    const { result } = renderHook(() => useBoos(boos));

    expect(result.current[0].counter).toBe(0);

    act(() => {
      result.current[1]((state) => {
        state.counter += 1;
      });
    });

    expect(result.current[0].counter).toBe(1);

    act(() => {
      result.current[1]((state) => {
        state.counter -= 2;
      });
    });

    expect(result.current[0].counter).toBe(-1);
  });
});
