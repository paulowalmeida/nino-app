import { useDeliveryZones } from '@pages/Settings/hooks/useDeliveryZones/useDeliveryZones'
import { useDiningTableMutations } from '@pages/Settings/hooks/useDiningTableMutations/useDiningTableMutations'
import { useDiningTables } from '@pages/Settings/hooks/useDiningTables/useDiningTables'
import { useMapLocation } from '@pages/Settings/hooks/useMapLocation/useMapLocation'
import { usePhoneMutations } from '@pages/Settings/hooks/usePhoneMutations/usePhoneMutations'
import { usePhones } from '@pages/Settings/hooks/usePhones/usePhones'
import { useRemoveTenant } from '@pages/Settings/hooks/useRemoveTenant/useRemoveTenant'
import { useSaveSettings } from '@pages/Settings/hooks/useSaveSettings/useSaveSettings'
import { useSaveTenant } from '@pages/Settings/hooks/useSaveTenant/useSaveTenant'
import { useSetMainTenant } from '@pages/Settings/hooks/useSetMainTenant/useSetMainTenant'
import { useTenantDetail } from '@pages/Settings/hooks/useTenantDetail/useTenantDetail'
import { useUnitLimit } from '@pages/Settings/hooks/useUnitLimit/useUnitLimit'
import { useZoneMutations } from '@pages/Settings/hooks/useZoneMutations/useZoneMutations'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

export const useSettingsFacade = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const groups = useCompanyGroups()
  const units = groups.flatMap(({ units: list }) => list)

  return {
    tenant,
    contact: {
      query: usePhones(tenantId),
      mutations: usePhoneMutations(tenantId),
    },
    delivery: {
      query: useDeliveryZones(tenantId),
      location: useMapLocation(tenantId),
      mutations: useZoneMutations(tenantId),
    },
    service: { query: useSettings(tenantId), save: useSaveSettings(tenantId) },
    diningTables: {
      query: useDiningTables(tenantId),
      mutations: useDiningTableMutations(tenantId),
    },
    units: {
      groups,
      detail: useTenantDetail(tenantId),
      limit: useUnitLimit(units.length),
      remove: useRemoveTenant(),
      save: useSaveTenant(tenantId),
      setMain: useSetMainTenant(tenantId),
    },
  }
}
