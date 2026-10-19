import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys/query-keys'

import { useSettleTab } from './useSettleTab'
import { settledTabMock, settleTabScopeMock } from './useSettleTab.mock'

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe('useSettleTab', () => {
  beforeEach(() => {
    client = new QueryClient()
  })

  it('writes the fresh tab into its detail cache and refreshes only the lists', () => {
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () => useSettleTab(settleTabScopeMock.unitId),
      { wrapper }
    )

    result.current(settledTabMock)

    expect(
      client.getQueryData(queryKeys.tabs.detail('unit-1', settledTabMock.id))
    ).toBe(settledTabMock)
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.tabs.lists('unit-1'),
    })
  })

  it('scopes the cache to an empty unit when none is selected', () => {
    const { result } = renderHook(() => useSettleTab(null), { wrapper })

    result.current(settledTabMock)

    expect(
      client.getQueryData(queryKeys.tabs.detail('', settledTabMock.id))
    ).toBe(settledTabMock)
  })
})
