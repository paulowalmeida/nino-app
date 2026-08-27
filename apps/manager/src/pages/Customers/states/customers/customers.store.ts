import { create } from 'zustand'

import { setSearch } from '@pages/Customers/states/customers/operations/set-search/set-search'
import type { CustomersState } from '@pages/Customers/types/CustomersState.type'

export const useCustomersStore = create<CustomersState>((set) => ({
  search: '',
  setSearch: (search) => setSearch(set, search),
}))
