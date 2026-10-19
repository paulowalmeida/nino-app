import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'

import { useTabTransitions } from './useTabTransitions'
import {
  tabTransitionsCancelRequestMock,
  tabTransitionsPayRequestMock,
  tabTransitionsScopeMock,
  tabTransitionsTabMock,
} from './useTabTransitions.mock'

vi.mock('@shared/services/tab/tab.service/tab.service', () => ({
  TabService: {
    closeTab: vi.fn(),
    reopenTab: vi.fn(),
    payTab: vi.fn(),
    cancelTab: vi.fn(),
  },
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

const renderTransitions = () =>
  renderHook(
    () =>
      useTabTransitions(
        tabTransitionsScopeMock.unitId,
        tabTransitionsScopeMock.tabId
      ),
    { wrapper }
  )

describe('useTabTransitions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.mocked(TabService.closeTab).mockResolvedValue(tabTransitionsTabMock)
    vi.mocked(TabService.reopenTab).mockResolvedValue(tabTransitionsTabMock)
    vi.mocked(TabService.payTab).mockResolvedValue(tabTransitionsTabMock)
    vi.mocked(TabService.cancelTab).mockResolvedValue(tabTransitionsTabMock)
  })

  it('closes the tab and confirms it', async () => {
    const { result } = renderTransitions()

    act(() => result.current.submitClose())

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Comanda fechada')
    )
    expect(TabService.closeTab).toHaveBeenCalledWith('unit-1', 'tab-2')
    expect(
      client.getQueryData(
        queryKeys.tabs.detail('unit-1', tabTransitionsTabMock.id)
      )
    ).toBe(tabTransitionsTabMock)
  })

  it('reopens the tab and confirms it', async () => {
    const { result } = renderTransitions()

    act(() => result.current.submitReopen())

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Comanda reaberta')
    )
    expect(TabService.reopenTab).toHaveBeenCalledWith('unit-1', 'tab-2')
  })

  it('registers the payment and confirms it', async () => {
    const { result } = renderTransitions()

    act(() => result.current.submitPay(tabTransitionsPayRequestMock))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Pagamento registrado')
    )
    expect(TabService.payTab).toHaveBeenCalledWith(
      'unit-1',
      'tab-2',
      tabTransitionsPayRequestMock
    )
  })

  it('cancels the tab with its reason and confirms it', async () => {
    const { result } = renderTransitions()

    act(() => result.current.submitCancel(tabTransitionsCancelRequestMock))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Comanda cancelada')
    )
    expect(TabService.cancelTab).toHaveBeenCalledWith(
      'unit-1',
      'tab-2',
      tabTransitionsCancelRequestMock
    )
  })

  it('reports each transition as pending while it runs', async () => {
    const pending = new Promise<never>(() => undefined)
    vi.mocked(TabService.closeTab).mockReturnValue(pending)
    vi.mocked(TabService.reopenTab).mockReturnValue(pending)
    vi.mocked(TabService.payTab).mockReturnValue(pending)
    vi.mocked(TabService.cancelTab).mockReturnValue(pending)
    const { result } = renderTransitions()

    act(() => result.current.submitClose())
    await waitFor(() => expect(result.current.isClosing).toBe(true))
    act(() => result.current.submitReopen())
    await waitFor(() => expect(result.current.isReopening).toBe(true))
    act(() => result.current.submitPay(tabTransitionsPayRequestMock))
    await waitFor(() => expect(result.current.isPaying).toBe(true))
    act(() => result.current.submitCancel(tabTransitionsCancelRequestMock))
    await waitFor(() => expect(result.current.isCancelling).toBe(true))
  })
})
