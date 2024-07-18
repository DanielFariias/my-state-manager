import { useSyncExternalStore } from 'react';

type SetterFn<T> = (prevState: T) => Partial<T>;
type setStateFn<T> = (partialState: Partial<T> | SetterFn<T>) => void;

export function CreateStore<TState extends Record<string, any>>(
  createState: (setState: setStateFn<TState>, getState: () => TState) => TState,
) {
  let state: TState;
  let listeners: Set<VoidFunction>;

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function getState() {
    return state;
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newValue,
    };

    notifyListeners();
  }

  function subscribe(listener: VoidFunction) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function useStore<TValue>(
    selector: (currentState: TState) => TValue,
  ): TValue {
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState, getState);
  listeners = new Set();

  return useStore;
}
