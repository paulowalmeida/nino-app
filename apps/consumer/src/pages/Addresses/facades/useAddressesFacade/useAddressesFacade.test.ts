import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDeleteAddress } from '@pages/Addresses/hooks/useDeleteAddress/useDeleteAddress'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useStore } from '@shared/hooks/useStore/useStore'
import { useSaveAddress } from '@pages/Addresses/hooks/useSaveAddress/useSaveAddress'
import { useAddressesStore } from '@pages/Addresses/states/addresses/addresses.store'
import { useAddressesFacade } from './useAddressesFacade'
import { useAddressesFacadeMock } from './useAddressesFacade.mock'

vi.mock('@pages/Addresses/hooks/useDeleteAddress/useDeleteAddress')
vi.mock('@shared/hooks/useStore/useStore')
vi.mock('react-router', () => ({
  useParams: () => ({ slug: 'burgao-centro' }),
}))
vi.mock('@pages/Addresses/hooks/useSaveAddress/useSaveAddress')
vi.mock('@pages/Addresses/states/addresses/addresses.store')
vi.mock('@shared/hooks/useMyAddresses/useMyAddresses')

describe('useAddressesFacade', () => {
  it('exposes only address data, commands, and interaction state', () => {
    const saveAddress = vi.fn()
    const deleteAddress = vi.fn()
    const startEditingAddress = vi.fn()
    const cancelEditingAddress = vi.fn()
    const requestDeleteAddress = vi.fn()
    const cancelDeleteAddress = vi.fn()

    vi.mocked(useMyAddresses).mockReturnValue({
      data: useAddressesFacadeMock.addresses,
      isPending: false,
    } as never)
    vi.mocked(useSaveAddress).mockReturnValue({
      mutate: saveAddress,
      isPending: false,
      isError: false,
    } as never)
    vi.mocked(useDeleteAddress).mockReturnValue({
      mutate: deleteAddress,
      isPending: false,
    } as never)
    vi.mocked(useStore).mockReturnValue({
      store: { id: 'unit-1', state: 'PA' },
    } as never)
    vi.mocked(useAddressesStore).mockImplementation((selector) =>
      selector({
        editingId: 'address-1',
        confirmingDeleteId: null,
        startEditing: startEditingAddress,
        cancelEditing: cancelEditingAddress,
        requestDelete: requestDeleteAddress,
        cancelDelete: cancelDeleteAddress,
      })
    )

    const { result } = renderHook(() => useAddressesFacade())

    expect(useMyAddresses).toHaveBeenCalledWith(true)
    expect(result.current.addresses).toBe(useAddressesFacadeMock.addresses)
    expect(result.current.saveAddress).toBe(saveAddress)
    expect(result.current.deleteAddress).toBe(deleteAddress)
    expect(useStore).toHaveBeenCalledWith('burgao-centro')
    expect(result.current.storeId).toBe('unit-1')
    expect(result.current.storeState).toBe('PA')
    expect(result.current.editingAddressId).toBe('address-1')
    expect(result.current.startEditingAddress).toBe(startEditingAddress)
    expect(result.current.cancelEditingAddress).toBe(cancelEditingAddress)
    expect(result.current.requestDeleteAddress).toBe(requestDeleteAddress)
    expect(result.current.cancelDeleteAddress).toBe(cancelDeleteAddress)
  })
})
