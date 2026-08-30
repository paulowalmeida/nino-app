import type { SetAccountAddressesState } from '@pages/Addresses/types/SetAccountAddressesState.type'

export const requestDelete = (set: SetAccountAddressesState, id: string) =>
  set({ confirmingDeleteId: id })

export const cancelDelete = (set: SetAccountAddressesState) =>
  set({ confirmingDeleteId: null })
