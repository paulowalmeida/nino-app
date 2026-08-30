import { create } from 'zustand'

import {
  cancelDelete,
  requestDelete,
} from '@pages/Addresses/states/addresses/operations/delete-confirmation/delete-confirmation'
import {
  cancelEditing,
  startEditing,
} from '@pages/Addresses/states/addresses/operations/editing/editing'
import type { AccountAddressesState } from '@pages/Addresses/types/AccountAddressesState.type'

export const useAddressesStore = create<AccountAddressesState>((set) => ({
  editingId: null,
  confirmingDeleteId: null,
  startEditing: (id) => startEditing(set, id),
  cancelEditing: () => cancelEditing(set),
  requestDelete: (id) => requestDelete(set, id),
  cancelDelete: () => cancelDelete(set),
}))
