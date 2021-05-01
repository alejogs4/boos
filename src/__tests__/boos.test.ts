import createBoos from '../createBoos';
import { Persistance } from '../options';

describe('Boos tests', () => {
  test('Boos should notify different listeners of given changes', () => {
    const subsOne = jest.fn();
    const subsTwo = jest.fn();

    const boos = createBoos({ initialValue: { number: 1 } });

    boos.subscribe(subsOne);
    boos.modifyValue((state) => ({ ...state, number: state.number + 1 }));

    expect(subsOne).toHaveBeenCalledWith({ number: 2 });
    expect(subsOne).toHaveBeenCalledTimes(1);

    boos.subscribe(subsTwo);

    function sum(state: { number: number }) {
      state.number += 1;
    }

    boos.modifyValue((state) => sum(state));

    expect(subsOne).toHaveBeenCalledTimes(2);
    expect(subsTwo).toHaveBeenCalledTimes(1);
    expect(subsOne).toHaveBeenCalledWith({ number: 3 });
    expect(subsTwo).toHaveBeenCalledWith({ number: 3 });

    boos.unsubscribe(subsOne);
    boos.modifyValue((state) => sum(state));

    expect(subsOne).toHaveBeenCalledTimes(2);
    expect(subsTwo).toHaveBeenCalledTimes(2);

    boos.unsubscribe(subsTwo);
    expect(boos.getValue()).toEqual({ number: 4 });
  });

  test("Should execute initial persistance setItem is element didn't exist before hand", () => {
    type Number = { number: number };

    const mockPersistance: Persistance<Number> = {
      existItem: jest.fn(() => false),
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    const buildPersistance = jest.fn(() => mockPersistance);
    const initialValue = { number: 1 };

    createBoos<Number>({
      initialValue,
      options: { persistanceBuilder: buildPersistance },
    });

    expect(mockPersistance.setItem).toHaveBeenCalledTimes(1);
    expect(mockPersistance.setItem).toHaveBeenCalledWith(initialValue);
  });
});
