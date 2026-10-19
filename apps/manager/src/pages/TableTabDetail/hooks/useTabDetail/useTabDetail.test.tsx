import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TabService } from '@shared/services/tab/tab.service/tab.service'

import { useTabDetail } from './useTabDetail'
import { tabDetailMock, tabDetailScopeMock } from './useTabDetail.mock'

vi.mock('@shared/services/tab/tab.service/tab.service', () => ({
  TabService: { getById: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useTabDetail', () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the tab scoped by unit', async () => {
    vi.mocked(TabService.getById).mockResolvedValue(tabDetailMock)

    const { result } = renderHook(
      () => useTabDetail(tabDetailScopeMock.unitId, tabDetailScopeMock.tabId),
      { wrapper }
    )

    await waitFor(() => expect(result.current.tab).toEqual(tabDetailMock))
    expect(TabService.getById).toHaveBeenCalledWith('unit-1', 'tab-1')
    expect(result.current.isPending).toBe(false)
  })

  it('exposes the failure when the tab cannot be loaded', async () => {
    vi.mocked(TabService.getById).mockRejectedValue(new Error('not found'))

    const { result } = renderHook(
      () => useTabDetail(tabDetailScopeMock.unitId, tabDetailScopeMock.tabId),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.tab).toBeUndefined()
  })

  it.each([
    ['unit', null, 'tab-1'],
    ['tab', 'unit-1', ''],
  ])('does not request without a %s', (_missing, unitId, tabId) => {
    renderHook(() => useTabDetail(unitId, tabId), { wrapper })

    expect(TabService.getById).not.toHaveBeenCalled()
  })
})
