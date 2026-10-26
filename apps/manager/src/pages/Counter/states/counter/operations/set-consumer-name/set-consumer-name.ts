import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setConsumerName = (set: SetCounterState, name: string) =>
  set({ consumerName: name })
