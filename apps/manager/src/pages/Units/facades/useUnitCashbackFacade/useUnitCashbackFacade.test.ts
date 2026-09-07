import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitCashbackFacade } from './useUnitCashbackFacade'
import { unitCashbackFacadeMock } from './useUnitCashbackFacade.mock'

let tenant: { tenantId: string } | null = { tenantId: unitCashbackFacadeMock.tenantId }

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => tenant,
}))
vi.mock('@shared/hooks/settings/useSettings/useSettings', () => ({
  useSettings: (tenantId: string | null) => ({
    tenantId,
    data: unitCashbackFacadeMock.settings,
  }),
}))
vi.mock('@pages/Units/hooks/useSaveCashback/useSaveCashback', () => ({
  useSaveCashback: (tenantId: string | null) => ({ tenantId }),
}))

describe(useUnitCashbackFacade.name, () => {
  it('reads and writes the settings of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitCashbackFacade())

    expect(result.current.query.data).toEqual(unitCashbackFacadeMock.settings)
    expect(result.current.save.tenantId).toBe(unitCashbackFacadeMock.tenantId)
  })

  it('asks for nothing while no unit is open', () => {
    tenant = null

    const { result } = renderHook(() => useUnitCashbackFacade())

    expect(result.current.save.tenantId).toBeNull()

    tenant = { tenantId: unitCashbackFacadeMock.tenantId }
  })
})
