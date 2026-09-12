import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

import { useConsumerSession } from './useConsumerSession'
import { useConsumerSessionMock } from './useConsumerSession.mock'

vi.mock('@shared/services/consumer-auth/consumer-auth.service')

let queryOptions: { queryKey: unknown; queryFn: () => unknown } | undefined

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

describe('useConsumerSession', () => {
  it('queries the current session under the session cache key', () => {
    // Arrange
    // Act
    renderHook(() => useConsumerSession())

    // Assert
    expect(queryOptions?.queryKey).toEqual(queryKeys.session.all)
  })

  it('resolves to null when the session request fails', async () => {
    // Arrange
    vi.mocked(consumerAuthService.getMe).mockRejectedValue(new Error('401'))
    renderHook(() => useConsumerSession())

    // Act
    const result = await queryOptions?.queryFn()

    // Assert
    expect(result).toBeNull()
  })

  it('resolves to the consumer when the session request succeeds', async () => {
    // Arrange
    vi.mocked(consumerAuthService.getMe).mockResolvedValue(
      useConsumerSessionMock.consumer
    )
    renderHook(() => useConsumerSession())

    // Act
    const result = await queryOptions?.queryFn()

    // Assert
    expect(result).toEqual(useConsumerSessionMock.consumer)
  })

  it('falls back to null consumer and forwards isPending while loading', () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useConsumerSession())

    // Assert
    expect(result.current.consumer).toBeNull()
    expect(result.current.isPending).toBe(true)
  })
})
