import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePause } from '@hooks/store/usePause'
import { TenantService } from '@services/tenant.service'

import { openPause } from './usePause.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(usePause.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the pause state for the tenant', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.getPause).mockResolvedValue(openPause)

    // Act
    const { result } = renderHook(() => usePause('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(openPause))
  })

  it('stays disabled with no tenant id', () => {
    // Arrange
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => usePause(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(TenantService.getPause).not.toHaveBeenCalled()
  })
})
