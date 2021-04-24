import produce from 'immer';
import { Boos, ValueModifier, Subscriber } from './boos';
import {
  buildInMemoryPersistance, PersistanceBuilder, LoggerOptions, logValueChanges,
} from './options';

interface BoosOptions<T> {
  persistanceBuilder?: PersistanceBuilder<T>;
  logger?: LoggerOptions<T>;
}

interface BoosParameters<T> {
  initialValue: T;
  options?: BoosOptions<T>;
}

function createBoos<T extends object>({
  initialValue,
  options = {
    persistanceBuilder: buildInMemoryPersistance(),
    logger: {
      active: false,
      tag: '',
    },
  },
}: BoosParameters<T>): Boos<T> {
  const persistance = options.persistanceBuilder
    ? options.persistanceBuilder(initialValue)
    : buildInMemoryPersistance<T>()(initialValue);

  if (!persistance.existItem()) {
    persistance.setItem(initialValue);
  }

  let subscribers: Array<Subscriber<T>> = [];
  let value = persistance.getItem();

  function notify() {
    subscribers.forEach((sub) => sub(value));
  }

  function modifyBoosValue(modifier: ValueModifier<T>): T {
    const newValue = produce(value, modifier);
    logValueChanges(options.logger, value, newValue);
    return newValue;
  }

  const createdBoos: Boos<T> = {
    subscribe(newSubscriber: Subscriber<T>) {
      subscribers.push(newSubscriber);
    },
    unsubscribe(subscriberToRemove: Subscriber<T>) {
      subscribers = subscribers.filter((sub) => sub !== subscriberToRemove);
    },
    modifyValue(modifier: ValueModifier<T>) {
      value = modifyBoosValue(modifier);
      persistance.setItem(value);
      notify();

      return value;
    },
    getValue() {
      return value;
    },
  };

  return createdBoos;
}

export default createBoos;
