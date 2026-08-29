import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  useCompleteProfile,
} from '@pages/account/hooks/useCompleteProfile/useCompleteProfile'
import {
  useCustomerSession,
} from '@shared/hooks/useCustomerSession/useCustomerSession'
import {
  useDeleteAddress,
} from '@pages/account/hooks/useDeleteAddress/useDeleteAddress'
import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import {
  useSaveAddress,
} from '@pages/account/hooks/useSaveAddress/useSaveAddress'
import {
  useAddressesStore,
} from '@pages/account/states/addresses/addresses.store'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'

import { useAccountFacade } from './useAccountFacade'
import { useAccountFacadeMock } from './useAccountFacade.mock'

vi.mock('@pages/account/hooks/useCompleteProfile/useCompleteProfile')
vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')
vi.mock('@pages/account/hooks/useDeleteAddress/useDeleteAddress')
vi.mock('@shared/hooks/useLogout/useLogout')
vi.mock('@shared/hooks/useMyAddresses/useMyAddresses')
vi.mock('@shared/hooks/useMyOrders/useMyOrders')
vi.mock('@pages/account/hooks/useSaveAddress/useSaveAddress')
vi.mock('@pages/account/states/addresses/addresses.store')
vi.mock('@shared/hooks/useStoreTint/useStoreTint')

describe('useAccountFacade', () => {
  it('exposes session, tint, query data, and mutation commands', () => {
    // Arrange
    const logoutMutate = vi.fn()
    const saveAddressMutate = vi.fn()
    const deleteAddressMutate = vi.fn()
    const completeProfileMutate = vi.fn()

    vi.mocked(useCustomerSession).mockReturnValue({
      customer: useAccountFacadeMock.customer,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomerSession>)

    vi.mocked(useStoreTint).mockReturnValue(useAccountFacadeMock.tint)

    vi.mocked(useMyOrders).mockReturnValue({
      data: useAccountFacadeMock.orders,
      isPending: false,
    } as unknown as ReturnType<typeof useMyOrders>)

    vi.mocked(useMyAddresses).mockReturnValue({
      data: useAccountFacadeMock.addresses,
      isPending: false,
    } as unknown as ReturnType<typeof useMyAddresses>)

    vi.mocked(useLogout).mockReturnValue({
      mutate: logoutMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)

    vi.mocked(useSaveAddress).mockReturnValue({
      mutate: saveAddressMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSaveAddress>)

    vi.mocked(useDeleteAddress).mockReturnValue({
      mutate: deleteAddressMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAddress>)

    vi.mocked(useCompleteProfile).mockReturnValue({
      mutate: completeProfileMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCompleteProfile>)

    const startEditing = vi.fn()
    const cancelEditing = vi.fn()
    const requestDelete = vi.fn()
    const cancelDelete = vi.fn()
    vi.mocked(useAddressesStore).mockReturnValue({
      editingId: 'address-1',
      confirmingDeleteId: null,
      startEditing,
      cancelEditing,
      requestDelete,
      cancelDelete,
    } as unknown as ReturnType<typeof useAddressesStore>)

    // Act
    const { result } = renderHook(() => useAccountFacade())

    // Assert
    expect(useMyOrders).toHaveBeenCalledWith(true)
    expect(useMyAddresses).toHaveBeenCalledWith(true)
    expect(result.current.customer).toBe(useAccountFacadeMock.customer)
    expect(result.current.tint).toBe(useAccountFacadeMock.tint)
    expect(result.current.orders).toBe(useAccountFacadeMock.orders)
    expect(result.current.addresses).toBe(useAccountFacadeMock.addresses)
    expect(result.current.logout).toBe(logoutMutate)
    expect(result.current.saveAddress).toBe(saveAddressMutate)
    expect(result.current.deleteAddress).toBe(deleteAddressMutate)
    expect(result.current.completeProfile).toBe(completeProfileMutate)
    expect(result.current.editingAddressId).toBe('address-1')
    expect(result.current.startEditingAddress).toBe(startEditing)
    expect(result.current.cancelEditingAddress).toBe(cancelEditing)
    expect(result.current.requestDeleteAddress).toBe(requestDelete)
    expect(result.current.cancelDeleteAddress).toBe(cancelDelete)
  })

  it('disables dependent queries while there is no customer session', () => {
    // Arrange
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: null,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomerSession>)

    vi.mocked(useStoreTint).mockReturnValue(undefined)
    vi.mocked(useMyOrders).mockReturnValue({
      data: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useMyOrders>)
    vi.mocked(useMyAddresses).mockReturnValue({
      data: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useMyAddresses>)
    vi.mocked(useLogout).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)
    vi.mocked(useSaveAddress).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSaveAddress>)
    vi.mocked(useDeleteAddress).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAddress>)
    vi.mocked(useCompleteProfile).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCompleteProfile>)
    vi.mocked(useAddressesStore).mockReturnValue({
      editingId: null,
      confirmingDeleteId: null,
      startEditing: vi.fn(),
      cancelEditing: vi.fn(),
      requestDelete: vi.fn(),
      cancelDelete: vi.fn(),
    } as unknown as ReturnType<typeof useAddressesStore>)

    // Act
    renderHook(() => useAccountFacade())

    // Assert
    expect(useMyOrders).toHaveBeenCalledWith(false)
    expect(useMyAddresses).toHaveBeenCalledWith(false)
  })
})
