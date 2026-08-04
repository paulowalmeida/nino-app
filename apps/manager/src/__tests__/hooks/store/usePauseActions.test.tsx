import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePauseActions } from '@hooks/store/usePauseActions'
import { TenantService } from '@services/tenant.service'

import { closedPause, openPause } from './usePause.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(usePauseActions.name, () => {
  it('writes the paused state into the cache on success', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.pauseStore).mockResolvedValue(closedPause)
    const { result } = renderHook(() => usePauseActions('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.pause.mutate({ reason: 'Sem entregador disponível' })

    // Assert
    await waitFor(() => expect(result.current.pause.isSuccess).toBe(true))
    expect(
      client.getQueryData(['tenant', 'tenant-1', 'pause'])
    ).toEqual(closedPause)
  })

  it('writes the resumed state into the cache on success', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.resumeStore).mockResolvedValue(openPause)
    const { result } = renderHook(() => usePauseActions('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.resume.mutate()

    // Assert
    await waitFor(() => expect(result.current.resume.isSuccess).toBe(true))
    expect(
      client.getQueryData(['tenant', 'tenant-1', 'pause'])
    ).toEqual(openPause)
  })
})
