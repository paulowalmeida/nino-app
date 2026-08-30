import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { addressService } from '@shared/services/address/address.service'

import { useSaveAddress } from './useSaveAddress'
import { useSaveAddressMock } from './useSaveAddress.mock'

vi.mock('@shared/services/address/address.service')

const invalidateQueries = vi.fn()

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

describe('useSaveAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a new address when no id is given', () => {
    // Arrange
    renderHook(() => useSaveAddress())

    // Act
    mutationFn?.({ data: useSaveAddressMock.data })

    // Assert
    expect(addressService.createMine).toHaveBeenCalledWith(
      useSaveAddressMock.data
    )
    expect(addressService.updateMine).not.toHaveBeenCalled()
  })

  it('updates the existing address when an id is given', () => {
    // Arrange
    renderHook(() => useSaveAddress())

    // Act
    mutationFn?.({ id: 'address-1', data: useSaveAddressMock.data })

    // Assert
    expect(addressService.updateMine).toHaveBeenCalledWith(
      'address-1',
      useSaveAddressMock.data
    )
    expect(addressService.createMine).not.toHaveBeenCalled()
  })

  it('invalidates the addresses cache on success', () => {
    // Arrange
    renderHook(() => useSaveAddress())

    // Act
    onSuccess?.()

    // Assert
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.myAddresses.all,
    })
  })
})
