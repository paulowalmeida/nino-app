import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'

import { useOpenTab } from './useOpenTab'
import {
  openedTabMock,
  openTabRequestMock,
  openTabScopeMock,
} from './useOpenTab.mock'

vi.mock('@shared/services/tab/tab.service/tab.service', () => ({
  TabService: { openTab: vi.fn() },
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe('useOpenTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('opens the tab, confirms it and refreshes the tab lists of the unit', async () => {
    vi.mocked(TabService.openTab).mockResolvedValue(
      openedTabMock as Awaited<ReturnType<typeof TabService.openTab>>
    )
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useOpenTab(openTabScopeMock.unitId), {
      wrapper,
    })

    act(() => result.current.submitOpen(openTabRequestMock))

    await waitFor(() =>
      expect(TabService.openTab).toHaveBeenCalledWith(
        'unit-1',
        openTabRequestMock
      )
    )
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Comanda aberta')
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.tabs.all('unit-1'),
    })
    await waitFor(() => expect(result.current.isOpening).toBe(false))
  })

  it('reports the pending state while the tab is being opened', async () => {
    vi.mocked(TabService.openTab).mockReturnValue(new Promise(() => undefined))
    const { result } = renderHook(() => useOpenTab(openTabScopeMock.unitId), {
      wrapper,
    })

    act(() => result.current.submitOpen(openTabRequestMock))

    await waitFor(() => expect(result.current.isOpening).toBe(true))
  })

  it('scopes the cache to an empty unit when none is selected', async () => {
    vi.mocked(TabService.openTab).mockResolvedValue(
      openedTabMock as Awaited<ReturnType<typeof TabService.openTab>>
    )
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useOpenTab(null), { wrapper })

    act(() => result.current.submitOpen(openTabRequestMock))

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: queryKeys.tabs.all(''),
      })
    )
  })
})
