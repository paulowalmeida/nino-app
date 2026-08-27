import type { CounterState } from './CounterState.type'

export type SetCounterState = (
  updater: Partial<CounterState> | ((state: CounterState) => Partial<CounterState>)
) => void
