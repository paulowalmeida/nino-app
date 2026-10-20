import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailActions } from '@pages/PositionDetail/hooks/usePositionDetailActions/usePositionDetailActions'
import { usePositionDetailQuery } from '@pages/PositionDetail/hooks/usePositionDetailQuery/usePositionDetailQuery'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { usePositionPermissions } from '@shared/hooks/team/usePositionPermissions/usePositionPermissions'

import { usePositionDetailFacade } from './usePositionDetailFacade'
import {
  positionDetailFacadeCatalogMock,
  positionDetailFacadePositionMock,
} from './usePositionDetailFacade.mock'

vi.mock('@pages/PositionDetail/hooks/usePositionDetailActions/usePositionDetailActions')
vi.mock('@pages/PositionDetail/hooks/usePositionDetailQuery/usePositionDetailQuery')
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/team/usePositionPermissions/usePositionPermissions')

const save = vi.fn()
const duplicate = vi.fn()
const remove = vi.fn()

const routeWrapper =
  (entry: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/cargos/novo" element={children} />
        <Route path="/cargos/:positionId" element={children} />
      </Routes>
    </MemoryRouter>
  )

describe(usePositionDetailFacade.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentUnit).mockReturnValue({ unitId: 'unit-1' } as never)
    vi.mocked(usePositionDetailQuery).mockReturnValue({
      position: positionDetailFacadePositionMock,
      isPending: false,
      isError: false,
    })
    vi.mocked(usePositionPermissions).mockReturnValue({
      data: positionDetailFacadeCatalogMock,
    } as never)
    vi.mocked(usePositionDetailActions).mockReturnValue({
      save,
      duplicate,
      remove,
      isDuplicating: false,
    })
  })

  it('exposes the addressed cargo, the catalog and the existing commands', () => {
    const { result } = renderHook(() => usePositionDetailFacade(), {
      wrapper: routeWrapper('/cargos/position-cashier'),
    })

    expect(usePositionDetailQuery).toHaveBeenCalledWith(
      'unit-1',
      'position-cashier'
    )
    expect(usePositionDetailActions).toHaveBeenCalledWith(
      'unit-1',
      'position-cashier'
    )
    expect(result.current.isCreating).toBe(false)
    expect(result.current.position).toBe(positionDetailFacadePositionMock)
    expect(result.current.permissionCatalog).toBe(
      positionDetailFacadeCatalogMock
    )
    expect(result.current.savePosition).toBe(save)
    expect(result.current.duplicatePosition).toBe(duplicate)
    expect(result.current.removePosition).toBe(remove)
    expect(result.current.isDuplicating).toBe(false)
  })

  it('is in creation mode on the new cargo route and tolerates missing data', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(usePositionPermissions).mockReturnValue({
      data: undefined,
    } as never)
    vi.mocked(usePositionDetailQuery).mockReturnValue({
      position: undefined,
      isPending: true,
      isError: true,
    })

    const { result } = renderHook(() => usePositionDetailFacade(), {
      wrapper: routeWrapper('/cargos/novo'),
    })

    expect(usePositionDetailQuery).toHaveBeenCalledWith(null, undefined)
    expect(result.current.isCreating).toBe(true)
    expect(result.current.permissionCatalog).toEqual([])
    expect(result.current.isPending).toBe(true)
    expect(result.current.isError).toBe(true)
  })
})
