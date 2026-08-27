import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSettingsFacade } from './useSettingsFacade'

const hook = vi.hoisted(() => () => ({ data: undefined, isPending: false, mutate: vi.fn(), mutateAsync: vi.fn() }))
vi.mock('@pages/Settings/hooks/useCompany/useCompany', () => ({ useCompany: hook }))
vi.mock('@pages/Settings/hooks/useSaveCompany/useSaveCompany', () => ({ useSaveCompany: hook }))
vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({ useCompanyGroups: () => [] }))
vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({ useCurrentTenant: () => ({ tenantId: 'tenant-1' }) }))
vi.mock('@pages/Settings/hooks/useDeliveryZones/useDeliveryZones', () => ({ useDeliveryZones: hook }))
vi.mock('@shared/hooks/settings/useOpeningHours/useOpeningHours', () => ({ useOpeningHours: hook }))
vi.mock('@pages/Settings/hooks/usePhoneMutations/usePhoneMutations', () => ({ usePhoneMutations: hook }))
vi.mock('@pages/Settings/hooks/usePhones/usePhones', () => ({ usePhones: hook }))
vi.mock('@pages/Settings/hooks/useSaveSettings/useSaveSettings', () => ({ useSaveSettings: hook }))
vi.mock('@pages/Settings/hooks/useSaveWeek/useSaveWeek', () => ({ useSaveWeek: hook }))
vi.mock('@pages/Settings/hooks/useSettings/useSettings', () => ({ useSettings: hook }))
vi.mock('@pages/Settings/hooks/useZoneMutations/useZoneMutations', () => ({ useZoneMutations: hook }))
vi.mock('@pages/Settings/hooks/useRemoveTenant/useRemoveTenant', () => ({ useRemoveTenant: hook }))
vi.mock('@pages/Settings/hooks/useSaveTenant/useSaveTenant', () => ({ useSaveTenant: hook }))
vi.mock('@pages/Settings/hooks/useSetMainTenant/useSetMainTenant', () => ({ useSetMainTenant: hook }))
vi.mock('@pages/Settings/hooks/useTenantDetail/useTenantDetail', () => ({ useTenantDetail: hook }))
vi.mock('@pages/Settings/hooks/useUnitLimit/useUnitLimit', () => ({ useUnitLimit: hook }))

describe(useSettingsFacade.name, () => {
  it('composes all settings domains behind one contract', () => {
    const { result } = renderHook(() => useSettingsFacade())
    expect(result.current.tenant?.tenantId).toBe('tenant-1')
    expect(result.current.company.query).toBeDefined()
    expect(result.current.units.limit).toBeDefined()
  })
})
