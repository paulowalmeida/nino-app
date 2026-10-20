import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DiningTableService } from '@shared/services/dining-table/dining-table.service/dining-table.service'

import { useDiningTables } from './useDiningTables'
import { useDiningTablesMock } from './useDiningTables.mock'

vi.mock(
  '@shared/services/dining-table/dining-table.service/dining-table.service',
  () => ({ DiningTableService: { list: vi.fn() } })
)

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe('useDiningTables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('lists the tables of the current store', async () => {
    vi.mocked(DiningTableService.list).mockResolvedValue(
      useDiningTablesMock.page as unknown as Awaited<
        ReturnType<typeof DiningTableService.list>
      >
    )

    const { result } = renderHook(
      () => useDiningTables(useDiningTablesMock.unitId),
      { wrapper }
    )

    await waitFor(() =>
      expect(result.current.tables).toEqual(useDiningTablesMock.page.data)
    )
    expect(DiningTableService.list).toHaveBeenCalledWith('unit-1')
  })

  it('waits for a store before asking for tables', () => {
    const { result } = renderHook(() => useDiningTables(null), { wrapper })

    expect(DiningTableService.list).not.toHaveBeenCalled()
    expect(result.current.tables).toEqual([])
  })
})
