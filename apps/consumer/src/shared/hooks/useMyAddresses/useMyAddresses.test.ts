import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { addressService } from '@shared/services/address/address.service'

import { useMyAddresses } from './useMyAddresses'
import { useMyAddressesMock } from './useMyAddresses.mock'

vi.mock('@shared/services/address/address.service')

let queryOptions:
  | {
      queryKey: unknown
      queryFn: unknown
      select: (addresses: unknown[]) => unknown[]
      enabled: boolean
    }
  | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: (options: typeof queryOptions) => {
      queryOptions = options
      return { data: undefined, isPending: true }
    },
  }
})

describe('useMyAddresses', () => {
  it('queries the addresses list under the my-addresses cache key', () => {
    // Arrange
    // Act
    renderHook(() => useMyAddresses(true))

    // Assert
    expect(queryOptions?.queryKey).toEqual(queryKeys.myAddresses.all)
    expect(queryOptions?.queryFn).toBe(addressService.listMine)
  })

  it('stays disabled while there is no consumer session', () => {
    // Arrange
    // Act
    renderHook(() => useMyAddresses(false))

    // Assert
    expect(queryOptions?.enabled).toBe(false)
  })

  it('sorts the primary address to the top', () => {
    // Arrange
    renderHook(() => useMyAddresses(true))

    // Act
    const sorted = queryOptions?.select(useMyAddressesMock.unordered)

    // Assert
    expect(sorted).toEqual(useMyAddressesMock.primaryFirst)
  })
})
