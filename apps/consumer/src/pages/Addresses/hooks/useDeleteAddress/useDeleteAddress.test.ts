import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { addressService } from '@shared/services/address/address.service'
import { useAddressesStore } from '@pages/Addresses/states/addresses/addresses.store'

import { useDeleteAddress } from './useDeleteAddress'
import { useDeleteAddressMock } from './useDeleteAddress.mock'

vi.mock('@shared/services/address/address.service')
vi.mock('@pages/Addresses/states/addresses/addresses.store')

const invalidateQueries = vi.fn()
const cancelDelete = vi.fn()

let onSuccess: (() => void) | undefined
let mutationFn: ((input: unknown) => unknown) | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries }),
    useMutation: (options: {
      mutationFn: typeof mutationFn
      onSuccess: typeof onSuccess
    }) => {
      mutationFn = options.mutationFn
      onSuccess = options.onSuccess
      return { mutate: vi.fn() }
    },
  }
})

describe('useDeleteAddress', () => {
  beforeEach(() => {
    vi.mocked(useAddressesStore.getState).mockReturnValue({
      cancelDelete,
    } as never)
  })
  it('sends the address id to the delete service', () => {
    // Arrange
    renderHook(() => useDeleteAddress())

    // Act
    mutationFn?.(useDeleteAddressMock.addressId)

    // Assert
    expect(addressService.deleteMine).toHaveBeenCalledWith(
      useDeleteAddressMock.addressId
    )
  })

  it('invalidates the addresses cache on success', () => {
    // Arrange
    renderHook(() => useDeleteAddress())

    // Act
    onSuccess?.()

    // Assert
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.myAddresses.all,
    })
    expect(cancelDelete).toHaveBeenCalledOnce()
  })
})
