import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CashService } from '@shared/services/cash/cash.service'

import { useCashSession } from './useCashSession'
import {
  closedSessionDateKeyMock,
  closedSessionMock,
  openSessionMock,
} from './useCashSession.mock'

vi.mock('@shared/services/cash/cash.service')

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe(useCashSession.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads the open session of the store when viewing today', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(openSessionMock)

    // Act
    const { result } = renderHook(
      () => useCashSession('unit-1', true, '2026-08-30'),
      { wrapper }
    )

    // Assert
    await waitFor(() => expect(result.current.session).toEqual(openSessionMock))
    expect(CashService.getCurrentSession).toHaveBeenCalledWith('unit-1')
    expect(CashService.getSessionByDate).not.toHaveBeenCalled()
  })

  it('reports no session when the drawer is closed today', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(null)

    // Act
    const { result } = renderHook(
      () => useCashSession('unit-1', true, '2026-08-30'),
      { wrapper }
    )

    // Assert
    await waitFor(() => expect(result.current.isLoadingSession).toBe(false))
    expect(result.current.session).toBeNull()
  })

  it('reads the session that covered a past date', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(null)
    vi.mocked(CashService.getSessionByDate).mockResolvedValue(closedSessionMock)

    // Act
    const { result } = renderHook(
      () => useCashSession('unit-1', false, closedSessionDateKeyMock),
      { wrapper }
    )

    // Assert
    await waitFor(() =>
      expect(result.current.session).toEqual(closedSessionMock)
    )
    expect(CashService.getSessionByDate).toHaveBeenCalledWith(
      'unit-1',
      closedSessionDateKeyMock
    )
  })

  it('still exposes the open session for a past date, for commands', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockResolvedValue(openSessionMock)
    vi.mocked(CashService.getSessionByDate).mockResolvedValue(closedSessionMock)

    // Act
    const { result } = renderHook(
      () => useCashSession('unit-1', false, closedSessionDateKeyMock),
      { wrapper }
    )

    // Assert
    await waitFor(() =>
      expect(result.current.currentSession).toEqual(openSessionMock)
    )
    expect(result.current.session).toEqual(closedSessionMock)
  })

  it('asks for nothing while the store is unknown', () => {
    const { result } = renderHook(
      () => useCashSession(null, true, '2026-08-30'),
      { wrapper }
    )

    expect(CashService.getCurrentSession).not.toHaveBeenCalled()
    expect(CashService.getSessionByDate).not.toHaveBeenCalled()
    expect(result.current.session).toBeNull()
  })

  it('surfaces a failed read', async () => {
    // Arrange
    vi.mocked(CashService.getCurrentSession).mockRejectedValue(
      new Error('offline')
    )

    // Act
    const { result } = renderHook(
      () => useCashSession('unit-1', true, '2026-08-30'),
      { wrapper }
    )

    // Assert
    await waitFor(() => expect(result.current.isSessionError).toBe(true))
  })
})
