export type ArgumentTypes<Func extends Function> = Func extends (...args: infer A) => any
  ? A
  : never;

export type ResultType<Func extends Function> = Func extends (...args: any) => any
  ? ReturnType<Func>
  : never;

export type MemoizedFunction<Func extends Function> = (...parameters: ArgumentTypes<Func>) => {
  fromMemory: boolean;
  result: ResultType<Func>;
};

export function memoizeFunction<Func extends Function>(fn: Func): MemoizedFunction<typeof fn> {
  const memoizeStore: Record<string, ResultType<typeof fn>> = {};

  return function memoizedFunction(...params: ArgumentTypes<typeof fn>) {
    const memoKey = params.reduce<string>((gotKey, param) => `${gotKey}-${JSON.stringify(param)}`, '');

    if (memoKey in memoizeStore) {
      return {
        result: memoizeStore[memoKey],
        fromMemory: true,
      };
    }

    const functionResult = fn(...params);
    memoizeStore[memoKey] = functionResult;

    return {
      result: functionResult,
      fromMemory: false,
    };
  };
}
