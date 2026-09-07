import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitHoursFacade } from './useUnitHoursFacade'
import { unitHoursFacadeMock } from './useUnitHoursFacade.mock'

let tenant: { tenantId: string } | null = { tenantId: unitHoursFacadeMock.tenantId }

const openingHoursSpy = vi.fn()
const saveWeekSpy = vi.fn()

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => tenant,
}))
vi.mock('@shared/hooks/settings/useOpeningHours/useOpeningHours', () => ({
  useOpeningHours: (tenantId: string | null) => {
    openingHoursSpy(tenantId)
    return { hours: unitHoursFacadeMock.hours }
  },
}))
vi.mock('@pages/Units/hooks/useSaveWeek/useSaveWeek', () => ({
  useSaveWeek: (tenantId: string | null) => {
    saveWeekSpy(tenantId)
    return { mutate: vi.fn(), isPending: false }
  },
}))

describe(useUnitHoursFacade.name, () => {
  it('reads and writes the week of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitHoursFacade())

    expect(result.current.query.hours).toEqual(unitHoursFacadeMock.hours)
    expect(openingHoursSpy).toHaveBeenCalledWith(unitHoursFacadeMock.tenantId)
    expect(saveWeekSpy).toHaveBeenCalledWith(unitHoursFacadeMock.tenantId)
  })

  it('asks for nothing while no unit is open', () => {
    tenant = null

    renderHook(() => useUnitHoursFacade())

    expect(openingHoursSpy).toHaveBeenCalledWith(null)
    expect(saveWeekSpy).toHaveBeenCalledWith(null)

    tenant = { tenantId: unitHoursFacadeMock.tenantId }
  })
})
