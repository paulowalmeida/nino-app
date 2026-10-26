import type { CounterStep } from '@pages/Counter/types/CounterStep.type'
import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setStep = (set: SetCounterState, step: CounterStep) =>
  set({ step })
