import { beforeEach, describe, expect, it } from 'vitest'

import {
  useAddressesStore,
} from '@pages/account/states/addresses/addresses.store'

describe('useAddressesStore', () => {
  beforeEach(() => {
    useAddressesStore.setState({
      editingId: null,
      confirmingDeleteId: null,
    })
  })

  it('tracks which address is being edited', () => {
    useAddressesStore.getState().startEditing('address-1')
    expect(useAddressesStore.getState().editingId).toBe('address-1')

    useAddressesStore.getState().cancelEditing()
    expect(useAddressesStore.getState().editingId).toBeNull()
  })

  it('tracks which address is pending delete confirmation', () => {
    useAddressesStore.getState().requestDelete('address-1')
    expect(useAddressesStore.getState().confirmingDeleteId).toBe('address-1')

    useAddressesStore.getState().cancelDelete()
    expect(useAddressesStore.getState().confirmingDeleteId).toBeNull()
  })

  it('keeps editing and delete confirmation independent', () => {
    const store = useAddressesStore.getState()

    store.startEditing('address-1')
    store.requestDelete('address-2')

    expect(useAddressesStore.getState().editingId).toBe('address-1')
    expect(useAddressesStore.getState().confirmingDeleteId).toBe('address-2')
  })
})
