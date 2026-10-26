import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDiningTables } from '@shared/hooks/dining-table/useDiningTables/useDiningTables'

import { useDiningTableSeats } from './useDiningTableSeats'
import { useDiningTableSeatsMock } from './useDiningTableSeats.mock'

vi.mock('@shared/hooks/dining-table/useDiningTables/useDiningTables')

describe('useDiningTableSeats', () => {
  it('crosses the store tables with the tabs open right now', () => {
    vi.mocked(useDiningTables).mockReturnValue({
      tables: useDiningTableSeatsMock.tables,
      isPending: false,
    } as unknown as ReturnType<typeof useDiningTables>)

    const { result } = renderHook(() =>
      useDiningTableSeats(
        useDiningTableSeatsMock.unitId,
        useDiningTableSeatsMock.activeTabs
      )
    )

    expect(useDiningTables).toHaveBeenCalledWith('unit-1')
    expect(result.current.seats).toEqual([
      { id: 'table-4', name: 'Mesa 4', openTabId: 'tab-1' },
      { id: 'table-5', name: 'Mesa 5', openTabId: null },
    ])
    expect(result.current.isLoadingSeats).toBe(false)
  })

  it('reports the tables still loading', () => {
    vi.mocked(useDiningTables).mockReturnValue({
      tables: [],
      isPending: true,
    } as unknown as ReturnType<typeof useDiningTables>)

    const { result } = renderHook(() =>
      useDiningTableSeats(useDiningTableSeatsMock.unitId, [])
    )

    expect(result.current.isLoadingSeats).toBe(true)
  })
})
