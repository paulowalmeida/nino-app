import { create } from 'zustand'

import { setSearch } from '@pages/Consumers/states/consumers/operations/set-search/set-search'
import type { ConsumersState } from '@pages/Consumers/types/ConsumersState.type'

export const useConsumersStore = create<ConsumersState>((set) => ({
  search: '',
  setSearch: (search) => setSearch(set, search),
}))
