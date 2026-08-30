import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CashService } from '@shared/services/cash/cash.service'

import { useCashSession } from './useCashSession'
import { openSessionMock } from './useCashSession.mock'

vi.mock('@shared/services/cash/cash.service')

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe(useCashSession.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads the open session of the store', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(
      openSessionMock
    )

    // Act
    const { result } = renderHook(() => useCashSession('tenant-1'), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.session).toEqual(
      openSessionMock
    ))
    expect(CashService.getCurrentSession).toHaveBeenCalledWith('tenant-1')
  })

  it('reports no session when the drawer is closed', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(null)

    // Act
    const { result } = renderHook(() => useCashSession('tenant-1'), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.isLoadingSession).toBe(false))
    expect(result.current.session).toBeNull()
  })

  it('asks for nothing while the store is unknown', () => {
    const { result } = renderHook(() => useCashSession(null), { wrapper })

    expect(CashService.getCurrentSession).not.toHaveBeenCalled()
    expect(result.current.session).toBeNull()
  })

  it('surfaces a failed read', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockRejectedValue(
      new Error('offline')
    )

    // Act
    const { result } = renderHook(() => useCashSession('tenant-1'), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.isSessionError).toBe(true))
  })
})
