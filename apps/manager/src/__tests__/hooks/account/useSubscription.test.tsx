import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@hooks/account/useSubscription'
import { AccountService } from '@services/account.service'

import { activeSubscription } from './useSubscription.mock'

vi.mock('@services/account.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSubscription.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the current subscription', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AccountService.getSubscription).mockResolvedValue(
      activeSubscription
    )

    // Act
    const { result } = renderHook(() => useSubscription(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() =>
      expect(result.current.data).toEqual(activeSubscription)
    )
  })

  it('does not retry when the request fails', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AccountService.getSubscription).mockRejectedValue(
      new Error('not found')
    )

    // Act
    const { result } = renderHook(() => useSubscription(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(AccountService.getSubscription).toHaveBeenCalledTimes(1)
  })
})
