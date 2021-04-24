import React from 'react';
import { Boos, ValueModifier } from './boos';

type BoosAccesor<T> = [T, (modifier: ValueModifier<T>) => void];

function useBoos<T>(boos: Boos<T>): BoosAccesor<T> {
  const [value, setValue] = React.useState(boos.getValue());

  const boosSubscriber = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
    },
    [setValue],
  );

  React.useEffect(() => {
    boos.subscribe(boosSubscriber);

    return () => {
      boos.unsubscribe(boosSubscriber);
    };
  }, [boos, boosSubscriber]);

  return [value, boos.modifyValue];
}

export default useBoos;
