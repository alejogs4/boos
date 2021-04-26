import { act, renderHook } from '@testing-library/react-hooks';
import createBoos from '../createBoos';
import useBoosPiece from '../useBoosPiece';

describe('useBoosPiece tests', () => {
  test('Should return derived value from the boos', () => {
    const boos = createBoos({ initialValue: { counter: 0 } });
    const isNegative = (state: { counter: number }) => state.counter < 0;

    const { result } = renderHook(() => useBoosPiece(boos, isNegative));

    expect(result.current).toBe(false);

    act(() => {
      boos.modifyValue((state) => {
        state.counter = -1;
      });
    });
    expect(result.current).toBe(true);

    act(() => {
      boos.modifyValue((state) => {
        state.counter += 6;
      });
    });
    expect(result.current).toBe(false);

    act(() => {
      boos.modifyValue((state) => {
        state.counter = -1;
      });
    });
    expect(result.current).toBe(true);
  });
});
