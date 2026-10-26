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

  it('normalizes a blank complement before creating an address', () => {
    renderHook(() => useSaveAddress())
    mutationFn?.({
      data: { ...useSaveAddressMock.data, complement: '   ' },
    })

    expect(addressService.createMine).toHaveBeenCalledWith({
      ...useSaveAddressMock.data,
      complement: undefined,
    })
  })

  it('makes an existing address primary with its current data', () => {
    const address = {
      id: 'address-1',
      street: 'Rua das Flores',
      number: '123',
      complement: null,
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR',
      zipCode: '01001000',
      isPrimary: false,
      createdAt: '2025-01-10T12:00:00.000Z',
      updatedAt: '2025-01-10T12:00:00.000Z',
    }
    const result = renderHook(() => useSaveAddress()).result.current
    result.makePrimary(address)

    expect(result.mutate).toHaveBeenCalledWith({
      id: address.id,
      data: {
        zipCode: address.zipCode,
        street: address.street,
        number: address.number,
        complement: undefined,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        isPrimary: true,
      },
    })
  })
})
