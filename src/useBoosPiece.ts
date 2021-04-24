import React from 'react';
import { Boos } from './boos';
import { memoizeFunction, doesNeedToChange } from './utils';

type PieceSelector<T, J> = (val: T) => J;

function useBoosPiece<T, J>(
  boos: Boos<T>,
  pieceSelector: PieceSelector<T, J>,
): J {
  const memoizedPieceSelector = React.useMemo(() => memoizeFunction(pieceSelector), []);
  const [value, setValue] = React.useState(() => memoizedPieceSelector(boos.getValue()));

  const modifyValueInChange = React.useCallback((newValue: T) => {
    const newPieceResult = memoizedPieceSelector(newValue);
    if (newPieceResult.fromMemory) return;

    const shouldChange = doesNeedToChange(value.result, newPieceResult.result);

    if (!shouldChange) return;

    setValue(newPieceResult);
  }, [memoizedPieceSelector, value]);

  React.useEffect(() => {
    boos.subscribe(modifyValueInChange);

    return () => {
      boos.unsubscribe(modifyValueInChange);
    };
  }, [boos, modifyValueInChange]);

  return value.result;
}

export default useBoosPiece;
