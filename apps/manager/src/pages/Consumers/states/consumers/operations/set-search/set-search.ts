import type { SetConsumersState } from '@pages/Consumers/types/SetConsumersState.type'

export const setSearch = (set: SetConsumersState, search: string) =>
  set({ search })
