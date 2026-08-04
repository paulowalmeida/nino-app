import type { ReactNode } from 'react'

import { MemoryRouter } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useRemoveTenant } from '@hooks/store/useRemoveTenant'
import { TenantService } from '@services/tenant.service'
import { useSessionStore } from '@states/useSessionStore'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
  return wrapper
}

describe(useRemoveTenant.name, () => {
  it('clears the session store on success', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.removeTenant).mockResolvedValue({
      message: 'removed',
    })
    const clear = vi.spyOn(useSessionStore.getState(), 'clear')
    const { result } = renderHook(() => useRemoveTenant(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('tenant-1')

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clear).toHaveBeenCalledTimes(1)
  })

  it('reports the mutation as failed when the request errors', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.removeTenant).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useRemoveTenant(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('tenant-1')

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
