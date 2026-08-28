import { useCompany } from '@pages/Settings/hooks/useCompany/useCompany'
import { useDeliveryZones } from '@pages/Settings/hooks/useDeliveryZones/useDeliveryZones'
import { useMapLocation } from '@pages/Settings/hooks/useMapLocation/useMapLocation'
import { usePhoneMutations } from '@pages/Settings/hooks/usePhoneMutations/usePhoneMutations'
import { usePhones } from '@pages/Settings/hooks/usePhones/usePhones'
import { useRemoveTenant } from '@pages/Settings/hooks/useRemoveTenant/useRemoveTenant'
import { useSaveCompany } from '@pages/Settings/hooks/useSaveCompany/useSaveCompany'
import { useSaveSettings } from '@pages/Settings/hooks/useSaveSettings/useSaveSettings'
import { useSaveTenant } from '@pages/Settings/hooks/useSaveTenant/useSaveTenant'
import { useSaveWeek } from '@pages/Settings/hooks/useSaveWeek/useSaveWeek'
import { useSetMainTenant } from '@pages/Settings/hooks/useSetMainTenant/useSetMainTenant'
import { useSettings } from '@pages/Settings/hooks/useSettings/useSettings'
import { useTenantDetail } from '@pages/Settings/hooks/useTenantDetail/useTenantDetail'
import { useUnitLimit } from '@pages/Settings/hooks/useUnitLimit/useUnitLimit'
import { useZoneMutations } from '@pages/Settings/hooks/useZoneMutations/useZoneMutations'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useOpeningHours } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'

export const useSettingsFacade = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const groups = useCompanyGroups()
  const units = groups.flatMap(({ units: list }) => list)

  return {
    tenant,
    company: { query: useCompany(), save: useSaveCompany() },
    contact: {
      query: usePhones(tenantId),
      mutations: usePhoneMutations(tenantId),
    },
    delivery: {
      query: useDeliveryZones(tenantId),
      location: useMapLocation(tenantId),
      mutations: useZoneMutations(tenantId),
    },
    hours: { query: useOpeningHours(tenantId), save: useSaveWeek(tenantId) },
    service: { query: useSettings(tenantId), save: useSaveSettings(tenantId) },
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
