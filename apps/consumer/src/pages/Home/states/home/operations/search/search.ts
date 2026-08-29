import type { SetHomeInteractionState } from '@pages/Home/types/SetHomeInteractionState.type'

export const setHomeSearch = (set: SetHomeInteractionState, search: string) =>
  set({ search })
