import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'

import { useTabItemCommands } from './useTabItemCommands'
import {
  tabItemCommandsAddRequestMock,
  tabItemCommandsItemIdMock,
  tabItemCommandsScopeMock,
  tabItemCommandsTabMock,
} from './useTabItemCommands.mock'

vi.mock('@shared/services/tab/tab.service/tab.service', () => ({
  TabService: { addItem: vi.fn(), cancelItem: vi.fn() },
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

const renderCommands = () =>
  renderHook(
    () =>
      useTabItemCommands(
        tabItemCommandsScopeMock.unitId,
        tabItemCommandsScopeMock.tabId
      ),
    { wrapper }
  )

describe('useTabItemCommands', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('launches an item and puts the recalculated tab in the cache', async () => {
    vi.mocked(TabService.addItem).mockResolvedValue(tabItemCommandsTabMock)
    const { result } = renderCommands()

    act(() => result.current.submitAddItem(tabItemCommandsAddRequestMock))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Item lançado')
    )
    expect(TabService.addItem).toHaveBeenCalledWith(
      'unit-1',
      'tab-1',
      tabItemCommandsAddRequestMock
    )
    expect(
      client.getQueryData(
        queryKeys.tabs.detail('unit-1', tabItemCommandsTabMock.id)
      )
    ).toBe(tabItemCommandsTabMock)
  })

  it('cancels an item and puts the recalculated tab in the cache', async () => {
    vi.mocked(TabService.cancelItem).mockResolvedValue(tabItemCommandsTabMock)
    const { result } = renderCommands()

    act(() => result.current.submitCancelItem(tabItemCommandsItemIdMock))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Item cancelado')
    )
    expect(TabService.cancelItem).toHaveBeenCalledWith(
      'unit-1',
      'tab-1',
      tabItemCommandsItemIdMock
    )
  })

  it('reports each command as pending while it runs', async () => {
    vi.mocked(TabService.addItem).mockReturnValue(new Promise(() => undefined))
    vi.mocked(TabService.cancelItem).mockReturnValue(
      new Promise(() => undefined)
    )
    const { result } = renderCommands()

    act(() => result.current.submitAddItem(tabItemCommandsAddRequestMock))
    await waitFor(() => expect(result.current.isAddingItem).toBe(true))
    expect(result.current.isCancellingItem).toBe(false)

    act(() => result.current.submitCancelItem(tabItemCommandsItemIdMock))
    await waitFor(() => expect(result.current.isCancellingItem).toBe(true))
  })
})
