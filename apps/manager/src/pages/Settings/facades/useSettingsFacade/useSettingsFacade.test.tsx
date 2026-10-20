import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSettingsFacade } from './useSettingsFacade'

const hook = vi.hoisted(() => () => ({
  data: undefined,
  isPending: false,
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
}))
vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [],
}))
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))
vi.mock('@pages/Settings/hooks/useDeliveryZones/useDeliveryZones', () => ({
  useDeliveryZones: hook,
}))
vi.mock('@shared/hooks/dining-table/useDiningTables/useDiningTables', () => ({
  useDiningTables: hook,
}))
vi.mock(
  '@pages/Settings/hooks/useDiningTableMutations/useDiningTableMutations',
  () => ({
    useDiningTableMutations: hook,
  })
)
vi.mock('@shared/hooks/settings/useOpeningHours/useOpeningHours', () => ({
  useOpeningHours: hook,
}))
vi.mock('@pages/Settings/hooks/useMapLocation/useMapLocation', () => ({
  useMapLocation: hook,
}))
vi.mock('@pages/Settings/hooks/usePhoneMutations/usePhoneMutations', () => ({
  usePhoneMutations: hook,
}))
vi.mock('@pages/Settings/hooks/usePhones/usePhones', () => ({
  usePhones: hook,
}))
vi.mock('@pages/Settings/hooks/useSaveCashback/useSaveCashback', () => ({
  useSaveCashback: hook,
}))
vi.mock('@pages/Settings/hooks/useSaveSettings/useSaveSettings', () => ({
  useSaveSettings: hook,
}))
vi.mock('@shared/hooks/settings/useSettings/useSettings', () => ({
  useSettings: hook,
}))
vi.mock('@pages/Settings/hooks/useZoneMutations/useZoneMutations', () => ({
  useZoneMutations: hook,
}))
vi.mock('@pages/Settings/hooks/useRemoveUnit/useRemoveUnit', () => ({
  useRemoveUnit: hook,
}))
vi.mock('@pages/Settings/hooks/useSaveUnit/useSaveUnit', () => ({
  useSaveUnit: hook,
}))
vi.mock('@pages/Settings/hooks/useSetMainUnit/useSetMainUnit', () => ({
  useSetMainUnit: hook,
}))
vi.mock('@pages/Settings/hooks/useUnitDetail/useUnitDetail', () => ({
  useUnitDetail: hook,
}))
vi.mock('@pages/Settings/hooks/useUnitLimit/useUnitLimit', () => ({
  useUnitLimit: hook,
}))

describe(useSettingsFacade.name, () => {
  it('composes all settings domains behind one contract', () => {
    const { result } = renderHook(() => useSettingsFacade())
    expect(result.current.unit?.unitId).toBe('unit-1')
    expect(result.current.units.limit).toBeDefined()
  })
})
