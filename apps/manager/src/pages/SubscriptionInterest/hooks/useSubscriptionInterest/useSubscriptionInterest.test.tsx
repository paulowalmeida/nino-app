import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountService } from '@shared/services/account/account.service'

import { useSubscriptionInterest } from './useSubscriptionInterest'
import {
  subscriptionInterestInputMock,
  subscriptionInterestResponseMock,
} from './useSubscriptionInterest.mock'

vi.mock('@shared/services/account/account.service')

let queryClient: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe(useSubscriptionInterest.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
  })

  it('sends the interest request', async () => {
    // Arrange
    vi.mocked(AccountService.requestSubscriptionInterest).mockResolvedValue(
      subscriptionInterestResponseMock
    )
    const { result } = renderHook(() => useSubscriptionInterest(), {
      wrapper,
    })

    // Act
    await act(async () => {
      await result.current.mutateAsync(subscriptionInterestInputMock)
    })

    // Assert
    expect(AccountService.requestSubscriptionInterest).toHaveBeenCalledWith(
      subscriptionInterestInputMock,
      expect.anything()
    )
    await waitFor(() =>
      expect(result.current.data).toEqual(subscriptionInterestResponseMock)
    )
  })

  it('reports a failed request', async () => {
    // Arrange
    vi.mocked(AccountService.requestSubscriptionInterest).mockRejectedValue(
      new Error('offline')
    )
    const { result } = renderHook(() => useSubscriptionInterest(), {
      wrapper,
    })

    // Act
    act(() => {
      result.current.mutate(subscriptionInterestInputMock)
    })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
