import type { SetAccountAddressesState } from '@pages/Addresses/types/SetAccountAddressesState.type'

export const startEditing = (set: SetAccountAddressesState, id: string) =>
  set({ editingId: id })

export const cancelEditing = (set: SetAccountAddressesState) =>
  set({ editingId: null })
