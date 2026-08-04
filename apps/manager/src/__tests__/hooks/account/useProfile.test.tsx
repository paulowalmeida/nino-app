import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProfile } from '@hooks/account/useProfile'
import { AccountService } from '@services/account.service'

import { profile } from './useProfile.mock'

vi.mock('@services/account.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useProfile.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the current profile', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AccountService.getProfile).mockResolvedValue(profile)

    // Act
    const { result } = renderHook(() => useProfile(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(profile))
  })

  it('reports the error when the profile fails to load', async () => {
    // Arrange
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    vi.mocked(AccountService.getProfile).mockRejectedValue(
      new Error('network error')
    )

    // Act
    const { result } = renderHook(() => useProfile(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
