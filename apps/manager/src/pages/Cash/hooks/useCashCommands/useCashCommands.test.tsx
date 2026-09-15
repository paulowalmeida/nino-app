import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CashService } from '@shared/services/cash/cash.service'

import { openSessionMock } from '../useCashSession/useCashSession.mock'
import { useCashCommands } from './useCashCommands'
import {
  cashClosingMock,
  cashDepositMock,
  cashOpeningFloatMock,
  cashWithdrawalMock,
} from './useCashCommands.mock'

vi.mock('@shared/services/cash/cash.service')
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

const renderCommands = () =>
  renderHook(() => useCashCommands('unit-1', 'session-1'), { wrapper })

describe(useCashCommands.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('opens the drawer with the float left in it', async () => {
    // Arrange
    vi.mocked(CashService.openSession).mockResolvedValue(openSessionMock)
    const { result } = renderCommands()

    // Act
    result.current.submitOpen(cashOpeningFloatMock)

    // Assert
    await waitFor(() =>
      expect(CashService.openSession).toHaveBeenCalledWith('unit-1', {
        openingFloat: cashOpeningFloatMock,
      })
    )
    expect(toast.success).toHaveBeenCalledWith('Caixa aberto')
  })

  it('writes the fresh session straight into the cache', async () => {
    // Arrange
    vi.mocked(CashService.openSession).mockResolvedValue(openSessionMock)
    const { result } = renderCommands()

    // Act
    result.current.submitOpen(cashOpeningFloatMock)

    // Assert
    await waitFor(() =>
      expect(client.getQueryData(queryKeys.cash.current('unit-1'))).toEqual(
        openSessionMock
      )
    )
  })

  it('names a withdrawal for what it is', async () => {
    // Arrange
    vi.mocked(CashService.addMovement).mockResolvedValue(openSessionMock)
    const { result } = renderCommands()

    // Act
    result.current.submitMovement(cashWithdrawalMock)

    // Assert
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Sangria registrada')
    )
    expect(CashService.addMovement).toHaveBeenCalledWith(
      'unit-1',
      'session-1',
      cashWithdrawalMock
    )
  })

  it('names a deposit for what it is', async () => {
    // Arrange
    vi.mocked(CashService.addMovement).mockResolvedValue(openSessionMock)
    const { result } = renderCommands()

    // Act
    result.current.submitMovement(cashDepositMock)

    // Assert
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Suprimento registrado')
    )
  })

  it('drops the cached session once the drawer is closed', async () => {
    // Arrange
    vi.mocked(CashService.closeSession).mockResolvedValue(openSessionMock)
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderCommands()

    // Act
    result.current.submitClose(cashClosingMock)

    // Assert
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Caixa fechado')
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.cash.all('unit-1'),
    })
  })

  it('reports while a command is still running', async () => {
    // Arrange
    vi.mocked(CashService.openSession).mockReturnValue(new Promise(() => {}))
    const { result } = renderCommands()

    // Act
    result.current.submitOpen(cashOpeningFloatMock)

    // Assert
    await waitFor(() => expect(result.current.isOpening).toBe(true))
  })
})
