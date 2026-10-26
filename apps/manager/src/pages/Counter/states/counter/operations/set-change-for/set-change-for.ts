import type { StoreApi } from 'zustand'

import type { CounterState } from '@pages/Counter/types/CounterState.type'

export const setChangeFor = (
  set: StoreApi<CounterState>['setState'],
  value: string
): void => set({ changeFor: value })
