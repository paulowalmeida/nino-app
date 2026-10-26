import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useCouriers } from '@shared/hooks/team/useCouriers/useCouriers'
import { useStaff } from '@shared/hooks/team/useStaff/useStaff'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

import { useEmployeesData } from './useEmployeesData'
import {
  employeesDataCouriersMock,
  employeesDataMock,
  employeesDataPositionsMock,
} from './useEmployeesData.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/team/useStaff/useStaff')
vi.mock('@shared/hooks/team/useCouriers/useCouriers')
vi.mock('@shared/hooks/team/useUnitPositions/useUnitPositions')
vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: (selector: (state: { user: { id: string } }) => unknown) =>
    selector({ user: { id: 'user-1' } }),
}))

const loaded = { data: { data: [] }, isPending: false, isError: false }

describe(useEmployeesData.name, () => {
  beforeEach(() => {
    vi.mocked(useCurrentUnit).mockReturnValue(
      employeesDataMock.currentUnit as never
    )
    vi.mocked(useStaff).mockReturnValue(loaded as never)
    vi.mocked(useCouriers).mockReturnValue(loaded as never)
    vi.mocked(useUnitPositions).mockReturnValue({
      data: employeesDataPositionsMock,
    } as never)
  })

  it('assembles unit roster data and query state', () => {
    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.unitId).toBe('unit-1')
    expect(result.current.activeEntries).toEqual([])
    expect(result.current.isError).toBe(false)
  })

  it('offers invite seats for the cargos strictly below the signed-in one', () => {
    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.inviteSeats.map(({ value }) => value)).toEqual([
      'position-staff',
      'position-manager',
      'COURIER',
    ])
  })

  it('stays empty and flags errors while nothing has loaded', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useStaff).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: true,
    } as never)
    vi.mocked(useCouriers).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as never)
    vi.mocked(useUnitPositions).mockReturnValue({ data: undefined } as never)

    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.unitId).toBeNull()
    expect(result.current.activeEntries).toEqual([])
    expect(result.current.inactiveEntries).toEqual([])
    expect(result.current.inviteSeats.map(({ value }) => value)).toEqual([
      'COURIER',
    ])
    expect(result.current.isError).toBe(true)
  })

  it('flags an error that comes only from the couriers', () => {
    vi.mocked(useCouriers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as never)

    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.isError).toBe(true)
  })

  it('puts each courier in the tab that matches their activity', () => {
    vi.mocked(useCouriers).mockReturnValue({
      data: { data: employeesDataCouriersMock },
      isPending: false,
      isError: false,
    } as never)

    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.activeEntries.map(({ id }) => id)).toEqual([
      'courier-active',
    ])
    expect(result.current.inactiveEntries.map(({ id }) => id)).toEqual([
      'courier-parked',
    ])
  })

  it('keeps a tab loading while its couriers are still on the way', () => {
    vi.mocked(useCouriers).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as never)

    const { result } = renderHook(() => useEmployeesData())

    expect(result.current.isActivePending).toBe(true)
    expect(result.current.isInactivePending).toBe(true)
  })
})
