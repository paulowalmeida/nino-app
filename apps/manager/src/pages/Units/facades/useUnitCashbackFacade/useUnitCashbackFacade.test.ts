import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitCashbackFacade } from './useUnitCashbackFacade'
import { unitCashbackFacadeMock } from './useUnitCashbackFacade.mock'

let tenant: { tenantId: string } | null = { tenantId: unitCashbackFacadeMock.tenantId }

const settingsSpy = vi.fn()
const saveCashbackSpy = vi.fn()

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => tenant,
}))
vi.mock('@shared/hooks/settings/useSettings/useSettings', () => ({
  useSettings: (tenantId: string | null) => {
    settingsSpy(tenantId)
    return { data: unitCashbackFacadeMock.settings }
  },
}))
vi.mock('@pages/Units/hooks/useSaveCashback/useSaveCashback', () => ({
  useSaveCashback: (tenantId: string | null) => {
    saveCashbackSpy(tenantId)
    return { mutate: vi.fn(), isPending: false }
  },
}))

describe(useUnitCashbackFacade.name, () => {
  it('reads and writes the settings of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitCashbackFacade())

    expect(result.current.query.data).toEqual(unitCashbackFacadeMock.settings)
    expect(saveCashbackSpy).toHaveBeenCalledWith(unitCashbackFacadeMock.tenantId)
  })

  it('asks for nothing while no unit is open', () => {
    tenant = null

    renderHook(() => useUnitCashbackFacade())

    expect(settingsSpy).toHaveBeenCalledWith(null)
    expect(saveCashbackSpy).toHaveBeenCalledWith(null)

    tenant = { tenantId: unitCashbackFacadeMock.tenantId }
  })
})
