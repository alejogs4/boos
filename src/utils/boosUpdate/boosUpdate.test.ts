import { doesNeedToChange } from './values';
import { memoizeFunction } from './memoization';

describe('boosUpdate tests', () => {
  describe('doesNeedToChange tests', () => {
    const testCyclicObject = {
      a: 1,
      b: 3,
      c: {},
    };
    testCyclicObject.c = testCyclicObject;
    const secondTestCyclicObject = { ...testCyclicObject, d: 3 };

    const testsCases = [
      // Expected to change
      {
        name: 'Should return true if both values are of different type',
        valueOne: 1,
        valueTwo: '1',
        expected: true,
      },
      {
        name: 'Should return true if both numbers are different',
        valueOne: 1,
        valueTwo: 2,
        expected: true,
      },
      {
        name: 'Should return true if both booleans are different',
        valueOne: true,
        valueTwo: false,
        expected: true,
      },
      {
        name: 'Should return true if both strings are different',
        valueOne: 'value one',
        valueTwo: 'value two',
        expected: true,
      },
      {
        name: 'Should return true if both objects are different',
        valueOne: { a: 1 },
        valueTwo: { a: 2 },
        expected: true,
      },
      {
        name: 'Should return true if both objects are different shape',
        valueOne: { a: 1, c: 3 },
        valueTwo: { a: 1, b: 4 },
        expected: true,
      },
      {
        name: 'Should return true if both objects properties are different types',
        valueOne: { a: 1 },
        valueTwo: { a: '1' },
        expected: true,
      },
      {
        name: 'Should return true if both objects properties are arrays and these are differents',
        valueOne: { a: [1, 2] },
        valueTwo: { a: [1, 3] },
        expected: true,
      },
      {
        name: 'Should return true if both objects properties are objects and these are differents',
        valueOne: { a: { b: 1 } },
        valueTwo: { a: { b: 2 } },
        expected: true,
      },
      {
        name: 'Should return true if both arrays are different',
        valueOne: [1, 2, 3, 4],
        valueTwo: [1, 3, 2, 5],
        expected: true,
      },
      {
        name: 'Should return true if both arrays elements are different type',
        valueOne: [1, 2, 3, 4],
        valueTwo: ['1', '3', '2', '5'],
        expected: true,
      },
      {
        name: 'Should return true if both arrays contains different value',
        valueOne: [{ a: 1 }],
        valueTwo: [{ a: 5, b: 4 }],
        expected: true,
      },
      {
        name: 'Should return true if both arrays contains different shapes and values',
        valueOne: [{ a: 1 }],
        valueTwo: [{ b: 4 }, { a: 1 }],
        expected: true,
      },
      {
        name: 'Should return true if both objects are different even with cyclic objects',
        valueOne: testCyclicObject,
        valueTwo: secondTestCyclicObject,
        expected: true,
      },
      // Expected not to change
      {
        name: 'Should return false if both numbers are equal',
        valueOne: 1,
        valueTwo: 1,
        expected: false,
      },
      {
        name: 'Should return false if both booleans are equal',
        valueOne: true,
        valueTwo: true,
        expected: false,
      },
      {
        name: 'Should return false if both strings are equal',
        valueOne: 'Value one',
        valueTwo: 'Value one',
        expected: false,
      },
      {
        name: 'Should return false if both objects are equal',
        valueOne: { a: 1 },
        valueTwo: { a: 1 },
        expected: false,
      },
      {
        name: 'Should return false if both objects are equal in shape and values',
        valueOne: { a: 1, b: 4 },
        valueTwo: { a: 1, b: 4 },
        expected: false,
      },
      {
        name: 'Should return false if both arrays are equal',
        valueOne: [1, 2, 3, 4, 5, 6, 7],
        valueTwo: [1, 2, 3, 4, 5, 6, 7],
        expected: false,
      },
      {
        name: 'Should return false if both arrays are equal in values and shape',
        valueOne: [{ a: 1 }, { b: 2 }],
        valueTwo: [{ a: 1 }, { b: 2 }],
        expected: false,
      },
      {
        name: 'Should return false if both objects are equal even if they are deep',
        valueOne: [{ a: 1 }, { b: 2 }, { c: { d: { f: 1 } } }],
        valueTwo: [{ a: 1 }, { b: 2 }, { c: { d: { f: 1 } } }],
        expected: false,
      },
      {
        name: 'Should return false if both objects has equal reference',
        valueOne: testCyclicObject,
        valueTwo: testCyclicObject,
        expected: false,
      },
      {
        name: 'Should return false if both objects are equal reference',
        valueOne: testCyclicObject,
        valueTwo: testCyclicObject,
        expected: false,
      },
      {
        name: 'Should return false if both objects are equal even being cyclic',
        valueOne: testCyclicObject,
        valueTwo: { ...testCyclicObject },
        expected: false,
      },
    ];

    testsCases.forEach((testCase) => {
      test(testCase.name, () => {
        const needChange = doesNeedToChange(testCase.valueOne, testCase.valueTwo);
        expect(needChange).toBe(testCase.expected);
      });
    });
  });

  describe('memoizeFunction tests', () => {
    test('Should not returns the value from memory at first given the parameters', () => {
      const memoizedSum = memoizeFunction((a: number, b: number) => a + b);

      const firstResult = memoizedSum(1, 4);
      expect(firstResult.fromMemory).toBe(false);
      expect(firstResult.result).toBe(5);

      const secondResult = memoizedSum(1, 4);
      expect(secondResult.fromMemory).toBe(true);
      expect(secondResult.result).toBe(5);
    });

    test('Should not returns the value from memory at first given any forwaded parameters', () => {
      const memoizedSum = memoizeFunction((a: { a: Array<number> }, b: { a: Array<number> }) => {
        const aSum = a.a.reduce((acc, num) => acc + num, 0);
        const bSum = b.a.reduce((acc, num) => acc + num, 0);
        return aSum + bSum;
      });

      const firstResult = memoizedSum({ a: [1, 2, 3] }, { a: [4, 5] });
      expect(firstResult.fromMemory).toBe(false);
      expect(firstResult.result).toBe(15);

      const secondResult = memoizedSum({ a: [1, 2, 3] }, { a: [4, 5] });
      expect(secondResult.fromMemory).toBe(true);
      expect(secondResult.result).toBe(15);
    });
  });
});
