import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTabs } from '@pages/TableTabs/hooks/useTabs/useTabs'

import { useTabBoard } from './useTabBoard'
import { tabBoardMock } from './useTabBoard.mock'

vi.mock('@pages/TableTabs/hooks/useTabs/useTabs')

describe('useTabBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useTabs).mockImplementation((_unitId, statuses) =>
      statuses.includes('FINALIZED')
        ? tabBoardMock.finalized
        : tabBoardMock.active
    )
  })

  it('splits the in-progress tabs from the finalized ones', () => {
    const { result } = renderHook(() => useTabBoard(tabBoardMock.unitId))

    expect(useTabs).toHaveBeenCalledWith('unit-1', ['OPEN', 'AWAITING_PAYMENT'])
    expect(useTabs).toHaveBeenCalledWith('unit-1', ['FINALIZED'])
    expect(result.current.activeTabs).toBe(tabBoardMock.active.tabs)
    expect(result.current.finalizedTabs).toBe(tabBoardMock.finalized.tabs)
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('stays pending while either list is loading', () => {
    vi.mocked(useTabs).mockImplementation((_unitId, statuses) =>
      statuses.includes('FINALIZED')
        ? { ...tabBoardMock.finalized, isPending: true }
        : tabBoardMock.active
    )

    const { result } = renderHook(() => useTabBoard(tabBoardMock.unitId))

    expect(result.current.isPending).toBe(true)
  })

  it('reports an error when either list fails', () => {
    vi.mocked(useTabs).mockImplementation((_unitId, statuses) =>
      statuses.includes('FINALIZED')
        ? tabBoardMock.finalized
        : { ...tabBoardMock.active, isError: true }
    )

    const { result } = renderHook(() => useTabBoard(tabBoardMock.unitId))

    expect(result.current.isError).toBe(true)
  })
})
