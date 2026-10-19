import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOpenTab } from '@pages/TableTabs/hooks/useOpenTab/useOpenTab'
import { useTabBoard } from '@pages/TableTabs/hooks/useTabBoard/useTabBoard'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useTableTabsFacade } from './useTableTabsFacade'
import { tableTabsFacadeMock } from './useTableTabsFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/TableTabs/hooks/useTabBoard/useTabBoard')
vi.mock('@pages/TableTabs/hooks/useOpenTab/useOpenTab')

describe('useTableTabsFacade', () => {
  it('exposes the board and the open command under the current unit', () => {
    const submitOpen = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: tableTabsFacadeMock.unitId,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useTabBoard).mockReturnValue(tableTabsFacadeMock.board)
    vi.mocked(useOpenTab).mockReturnValue({ submitOpen, isOpening: true })

    const { result } = renderHook(() => useTableTabsFacade())

    expect(useTabBoard).toHaveBeenCalledWith('unit-1')
    expect(useOpenTab).toHaveBeenCalledWith('unit-1')
    expect(result.current.activeTabs).toBe(tableTabsFacadeMock.board.activeTabs)
    expect(result.current.finalizedTabs).toEqual([])
    expect(result.current.submitOpen).toBe(submitOpen)
    expect(result.current.isOpening).toBe(true)
  })

  it('falls back to no unit when none is selected', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useTabBoard).mockReturnValue(tableTabsFacadeMock.board)
    vi.mocked(useOpenTab).mockReturnValue({
      submitOpen: vi.fn(),
      isOpening: false,
    })

    renderHook(() => useTableTabsFacade())

    expect(useTabBoard).toHaveBeenLastCalledWith(null)
    expect(useOpenTab).toHaveBeenLastCalledWith(null)
  })
})
