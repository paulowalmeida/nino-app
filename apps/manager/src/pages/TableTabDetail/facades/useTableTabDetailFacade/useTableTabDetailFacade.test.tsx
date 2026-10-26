import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStoreServiceFee } from '@pages/TableTabDetail/hooks/useStoreServiceFee/useStoreServiceFee'
import { useTabDetail } from '@pages/TableTabDetail/hooks/useTabDetail/useTabDetail'
import { useTabItemCommands } from '@pages/TableTabDetail/hooks/useTabItemCommands/useTabItemCommands'
import { useTabPermissions } from '@pages/TableTabDetail/hooks/useTabPermissions/useTabPermissions'
import { useTabTransitions } from '@pages/TableTabDetail/hooks/useTabTransitions/useTabTransitions'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useTableTabDetailFacade } from './useTableTabDetailFacade'
import { tableTabDetailFacadeMock } from './useTableTabDetailFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/product/useMenu/useMenu')
vi.mock('@pages/TableTabDetail/hooks/useTabDetail/useTabDetail')
vi.mock('@pages/TableTabDetail/hooks/useTabItemCommands/useTabItemCommands')
vi.mock('@pages/TableTabDetail/hooks/useTabTransitions/useTabTransitions')
vi.mock('@pages/TableTabDetail/hooks/useTabPermissions/useTabPermissions')
vi.mock('@pages/TableTabDetail/hooks/useStoreServiceFee/useStoreServiceFee')

const mockHooks = (unit: { unitId: string } | null) => {
  const commands = {
    submitAddItem: vi.fn(),
    submitCancelItem: vi.fn(),
    submitClose: vi.fn(),
    submitReopen: vi.fn(),
    submitPay: vi.fn(),
    submitServiceFee: vi.fn(),
    submitCancel: vi.fn(),
  }
  vi.mocked(useCurrentUnit).mockReturnValue(
    unit as unknown as ReturnType<typeof useCurrentUnit>
  )
  vi.mocked(useTabDetail).mockReturnValue({
    tab: { id: 'tab-1' },
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useTabDetail>)
  vi.mocked(useMenu).mockReturnValue({
    sections: [{ id: 'category-1' }],
  } as unknown as ReturnType<typeof useMenu>)
  vi.mocked(useTabPermissions).mockReturnValue({ canCancelTab: true })
  vi.mocked(useStoreServiceFee).mockReturnValue({ storeServiceFeePercent: 10 })
  vi.mocked(useTabItemCommands).mockReturnValue({
    submitAddItem: commands.submitAddItem,
    submitCancelItem: commands.submitCancelItem,
    isAddingItem: true,
    isCancellingItem: false,
  })
  vi.mocked(useTabTransitions).mockReturnValue({
    submitClose: commands.submitClose,
    submitReopen: commands.submitReopen,
    submitPay: commands.submitPay,
    submitServiceFee: commands.submitServiceFee,
    submitCancel: commands.submitCancel,
    isClosing: false,
    isReopening: true,
    isPaying: false,
    isSettingServiceFee: true,
    isCancelling: true,
  })
  return commands
}

describe('useTableTabDetailFacade', () => {
  it('exposes the tab, the menu and every command under the route scope', () => {
    const commands = mockHooks({ unitId: tableTabDetailFacadeMock.unitId })

    const { result } = renderHook(() => useTableTabDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[tableTabDetailFacadeMock.route]}>
          <Routes>
            <Route
              path={tableTabDetailFacadeMock.routePattern}
              element={children}
            />
          </Routes>
        </MemoryRouter>
      ),
    })

    expect(useTabDetail).toHaveBeenCalledWith('unit-1', 'tab-1')
    expect(useTabItemCommands).toHaveBeenCalledWith('unit-1', 'tab-1')
    expect(useTabTransitions).toHaveBeenCalledWith('unit-1', 'tab-1')
    expect(useMenu).toHaveBeenCalledWith('unit-1')
    expect(result.current.tab).toEqual({ id: 'tab-1' })
    expect(result.current.menuSections).toEqual([{ id: 'category-1' }])
    expect(result.current.canCancelTab).toBe(true)
    expect(result.current.submitAddItem).toBe(commands.submitAddItem)
    expect(result.current.submitCancelItem).toBe(commands.submitCancelItem)
    expect(result.current.submitClose).toBe(commands.submitClose)
    expect(result.current.submitReopen).toBe(commands.submitReopen)
    expect(result.current.submitPay).toBe(commands.submitPay)
    expect(result.current.submitCancel).toBe(commands.submitCancel)
    expect(result.current.submitServiceFee).toBe(commands.submitServiceFee)
    expect(result.current.storeServiceFeePercent).toBe(10)
    expect(result.current.isSettingServiceFee).toBe(true)
    expect(result.current.isAddingItem).toBe(true)
    expect(result.current.isCancellingItem).toBe(false)
    expect(result.current.isClosing).toBe(false)
    expect(result.current.isReopening).toBe(true)
    expect(result.current.isPaying).toBe(false)
    expect(result.current.isCancelling).toBe(true)
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('falls back to an empty scope without unit or route param', () => {
    mockHooks(null)

    renderHook(() => useTableTabDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/comandas']}>{children}</MemoryRouter>
      ),
    })

    expect(useTabDetail).toHaveBeenLastCalledWith(null, '')
    expect(useTabItemCommands).toHaveBeenLastCalledWith(null, '')
    expect(useTabTransitions).toHaveBeenLastCalledWith(null, '')
    expect(useMenu).toHaveBeenLastCalledWith(null)
  })
})
