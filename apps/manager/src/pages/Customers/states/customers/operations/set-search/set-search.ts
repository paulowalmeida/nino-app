import type { SetCustomersState } from '@pages/Customers/types/SetCustomersState.type'

export const setSearch = (set: SetCustomersState, search: string) =>
  set({ search })
