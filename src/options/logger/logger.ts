/* eslint-disable no-console */
export type LoggerPredicate<T> = (value: T) => boolean;

export interface LoggerOptions<T> {
  active: LoggerPredicate<T> | boolean;
  tag: string;
}

export function logValueChanges<T>(
  options: LoggerOptions<T> | undefined,
  oldValue: T,
  newValue: T,
) {
  if (options && options.active) {
    if (typeof options.active === 'boolean' || options.active(oldValue)) {
      console.group(`%cOld ${options.tag} boos value`, 'color:tomato;');
      console.log(oldValue);
      console.groupEnd();

      console.group(`%cNew ${options.tag} boos value`, 'color:steelblue;');
      console.log(newValue);
      console.groupEnd();
    }
  }
}
