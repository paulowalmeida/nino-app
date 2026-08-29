import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { getMe } from '@services/customer-auth.service'

import { useCustomerSession } from './useCustomerSession'
import { useCustomerSessionMock } from './useCustomerSession.mock'

vi.mock('@services/customer-auth.service')

let queryOptions:
  | { queryKey: unknown; queryFn: () => unknown }
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

describe('useCustomerSession', () => {
  it('queries the current session under the session cache key', () => {
    // Arrange
    // Act
    renderHook(() => useCustomerSession())

    // Assert
    expect(queryOptions?.queryKey).toEqual(queryKeys.session.all)
  })

  it('resolves to null when the session request fails', async () => {
    // Arrange
    vi.mocked(getMe).mockRejectedValue(new Error('401'))
    renderHook(() => useCustomerSession())

    // Act
    const result = await queryOptions?.queryFn()

    // Assert
    expect(result).toBeNull()
  })

  it('resolves to the customer when the session request succeeds', async () => {
    // Arrange
    vi.mocked(getMe).mockResolvedValue(useCustomerSessionMock.customer)
    renderHook(() => useCustomerSession())

    // Act
    const result = await queryOptions?.queryFn()

    // Assert
    expect(result).toEqual(useCustomerSessionMock.customer)
  })

  it('falls back to null customer and forwards isPending while loading', () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useCustomerSession())

    // Assert
    expect(result.current.customer).toBeNull()
    expect(result.current.isPending).toBe(true)
  })
})
