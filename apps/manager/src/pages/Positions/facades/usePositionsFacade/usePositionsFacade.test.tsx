import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { usePositionCommands } from '@shared/hooks/team/usePositionCommands/usePositionCommands'
import { usePositionPermissions } from '@shared/hooks/team/usePositionPermissions/usePositionPermissions'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

import { usePositionsFacade } from './usePositionsFacade'
import {
  positionsFacadeCatalogMock,
  positionsFacadePositionsMock,
  positionsFacadeUnitMock,
} from './usePositionsFacade.mock'

vi.mock('@shared/hooks/team/usePositionCommands/usePositionCommands')
vi.mock('@shared/hooks/team/usePositionPermissions/usePositionPermissions')
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/team/useUnitPositions/useUnitPositions')

const duplicatePosition = vi.fn()
const removePosition = vi.fn()
const movePosition = vi.fn()

const givenCommands = (duplicate: object = { isPending: false }) =>
  vi.mocked(usePositionCommands).mockReturnValue({
    duplicate: { mutate: duplicatePosition, ...duplicate },
    update: { mutate: movePosition },
    remove: { mutateAsync: removePosition },
  } as never)

describe(usePositionsFacade.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentUnit).mockReturnValue(positionsFacadeUnitMock as never)
    vi.mocked(useUnitPositions).mockReturnValue({
      data: positionsFacadePositionsMock,
      isPending: false,
      isError: false,
    } as never)
    vi.mocked(usePositionPermissions).mockReturnValue({
      data: positionsFacadeCatalogMock,
    } as never)
    givenCommands()
  })

  it('exposes the cargos, the catalog and the existing commands', () => {
    const { result } = renderHook(() => usePositionsFacade())

    expect(useUnitPositions).toHaveBeenCalledWith('unit-1')
    expect(result.current.positions).toBe(positionsFacadePositionsMock)
    expect(result.current.permissionTotal).toBe(positionsFacadeCatalogMock.length)
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.duplicatePosition).toBe(duplicatePosition)
    expect(result.current.removePosition).toBe(removePosition)
    expect(result.current.movePosition).toBe(movePosition)
    expect(result.current.duplicatingId).toBeUndefined()
  })

  it('reports which cargo is being duplicated', () => {
    givenCommands({ isPending: true, variables: 'position-staff' })

    const { result } = renderHook(() => usePositionsFacade())

    expect(result.current.duplicatingId).toBe('position-staff')
  })

  it('falls back to empty lists while nothing has loaded', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useUnitPositions).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as never)
    vi.mocked(usePositionPermissions).mockReturnValue({
      data: undefined,
    } as never)

    const { result } = renderHook(() => usePositionsFacade())

    expect(useUnitPositions).toHaveBeenCalledWith(null)
    expect(result.current.positions).toEqual([])
    expect(result.current.permissionTotal).toBe(0)
    expect(result.current.isPending).toBe(true)
  })
})
