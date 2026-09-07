import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitHoursFacade } from './useUnitHoursFacade'
import { unitHoursFacadeMock } from './useUnitHoursFacade.mock'

let tenant: { tenantId: string } | null = { tenantId: unitHoursFacadeMock.tenantId }

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => tenant,
}))
vi.mock('@shared/hooks/settings/useOpeningHours/useOpeningHours', () => ({
  useOpeningHours: (tenantId: string | null) => ({
    tenantId,
    hours: unitHoursFacadeMock.hours,
  }),
}))
vi.mock('@pages/Units/hooks/useSaveWeek/useSaveWeek', () => ({
  useSaveWeek: (tenantId: string | null) => ({ tenantId }),
}))

describe(useUnitHoursFacade.name, () => {
  it('reads and writes the week of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitHoursFacade())

    expect(result.current.query.tenantId).toBe(unitHoursFacadeMock.tenantId)
    expect(result.current.query.hours).toEqual(unitHoursFacadeMock.hours)
    expect(result.current.save.tenantId).toBe(unitHoursFacadeMock.tenantId)
  })

  it('asks for nothing while no unit is open', () => {
    tenant = null

    const { result } = renderHook(() => useUnitHoursFacade())

    expect(result.current.save.tenantId).toBeNull()

    tenant = { tenantId: unitHoursFacadeMock.tenantId }
  })
})
