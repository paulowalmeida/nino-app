import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitHoursFacade } from './useUnitHoursFacade'
import { unitHoursFacadeMock } from './useUnitHoursFacade.mock'

let unit: { unitId: string } | null = { unitId: unitHoursFacadeMock.unitId }

const openingHoursSpy = vi.fn()
const saveWeekSpy = vi.fn()

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => unit,
}))
vi.mock('@shared/hooks/settings/useOpeningHours/useOpeningHours', () => ({
  useOpeningHours: (unitId: string | null) => {
    openingHoursSpy(unitId)
    return { hours: unitHoursFacadeMock.hours }
  },
}))
vi.mock('@pages/Units/hooks/useSaveWeek/useSaveWeek', () => ({
  useSaveWeek: (unitId: string | null) => {
    saveWeekSpy(unitId)
    return { mutate: vi.fn(), isPending: false }
  },
}))

describe(useUnitHoursFacade.name, () => {
  it('reads and writes the week of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitHoursFacade())

    expect(result.current.query.hours).toEqual(unitHoursFacadeMock.hours)
    expect(openingHoursSpy).toHaveBeenCalledWith(unitHoursFacadeMock.unitId)
    expect(saveWeekSpy).toHaveBeenCalledWith(unitHoursFacadeMock.unitId)
  })

  it('asks for nothing while no unit is open', () => {
    unit = null

    renderHook(() => useUnitHoursFacade())

    expect(openingHoursSpy).toHaveBeenCalledWith(null)
    expect(saveWeekSpy).toHaveBeenCalledWith(null)

    unit = { unitId: unitHoursFacadeMock.unitId }
  })
})
