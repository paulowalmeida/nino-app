import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitCashbackFacade } from './useUnitCashbackFacade'
import { unitCashbackFacadeMock } from './useUnitCashbackFacade.mock'

let unit: { unitId: string } | null = { unitId: unitCashbackFacadeMock.unitId }

const settingsSpy = vi.fn()
const saveCashbackSpy = vi.fn()

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => unit,
}))
vi.mock('@shared/hooks/settings/useSettings/useSettings', () => ({
  useSettings: (unitId: string | null) => {
    settingsSpy(unitId)
    return { data: unitCashbackFacadeMock.settings }
  },
}))
vi.mock('@pages/Units/hooks/useSaveCashback/useSaveCashback', () => ({
  useSaveCashback: (unitId: string | null) => {
    saveCashbackSpy(unitId)
    return { mutate: vi.fn(), isPending: false }
  },
}))

describe(useUnitCashbackFacade.name, () => {
  it('reads and writes the settings of the unit open in the session', () => {
    const { result } = renderHook(() => useUnitCashbackFacade())

    expect(result.current.query.data).toEqual(unitCashbackFacadeMock.settings)
    expect(saveCashbackSpy).toHaveBeenCalledWith(unitCashbackFacadeMock.unitId)
  })

  it('asks for nothing while no unit is open', () => {
    unit = null

    renderHook(() => useUnitCashbackFacade())

    expect(settingsSpy).toHaveBeenCalledWith(null)
    expect(saveCashbackSpy).toHaveBeenCalledWith(null)

    unit = { unitId: unitCashbackFacadeMock.unitId }
  })
})
