import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import {
  createMyAddress,
  updateMyAddress,
} from '@services/address.service'

import { useSaveAddress } from './useSaveAddress'
import { useSaveAddressMock } from './useSaveAddress.mock'

vi.mock('@services/address.service')

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
    expect(createMyAddress).toHaveBeenCalledWith(useSaveAddressMock.data)
    expect(updateMyAddress).not.toHaveBeenCalled()
  })

  it('updates the existing address when an id is given', () => {
    // Arrange
    renderHook(() => useSaveAddress())

    // Act
    mutationFn?.({ id: 'address-1', data: useSaveAddressMock.data })

    // Assert
    expect(updateMyAddress).toHaveBeenCalledWith(
      'address-1',
      useSaveAddressMock.data
    )
    expect(createMyAddress).not.toHaveBeenCalled()
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
