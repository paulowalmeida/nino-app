import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TabService } from '@shared/services/tab/tab.service/tab.service'

import { useTabs } from './useTabs'
import { tabsPageMock, tabsScopeMock } from './useTabs.mock'

vi.mock('@shared/services/tab/tab.service/tab.service', () => ({
  TabService: { listTabs: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useTabs', () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the tabs of the requested statuses', async () => {
    vi.mocked(TabService.listTabs).mockResolvedValue(tabsPageMock)

    const { result } = renderHook(
      () => useTabs(tabsScopeMock.unitId, tabsScopeMock.statuses),
      { wrapper }
    )

    await waitFor(() => expect(result.current.tabs).toEqual(tabsPageMock.data))
    expect(TabService.listTabs).toHaveBeenCalledWith('unit-1', [
      'OPEN',
      'AWAITING_PAYMENT',
    ])
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('exposes the failure and an empty list when the request fails', async () => {
    vi.mocked(TabService.listTabs).mockRejectedValue(new Error('offline'))

    const { result } = renderHook(
      () => useTabs(tabsScopeMock.unitId, tabsScopeMock.statuses),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.tabs).toEqual([])
  })

  it('does not request without a unit', () => {
    const { result } = renderHook(() => useTabs(null, tabsScopeMock.statuses), {
      wrapper,
    })

    expect(TabService.listTabs).not.toHaveBeenCalled()
    expect(result.current.tabs).toEqual([])
  })
})
