import { useDeliveryZones } from '@pages/Settings/hooks/useDeliveryZones/useDeliveryZones'
import { useDiningTableMutations } from '@pages/Settings/hooks/useDiningTableMutations/useDiningTableMutations'
import { useDiningTables } from '@shared/hooks/dining-table/useDiningTables/useDiningTables'
import { useMapLocation } from '@pages/Settings/hooks/useMapLocation/useMapLocation'
import { usePhoneMutations } from '@pages/Settings/hooks/usePhoneMutations/usePhoneMutations'
import { usePhones } from '@pages/Settings/hooks/usePhones/usePhones'
import { useRemoveUnit } from '@pages/Settings/hooks/useRemoveUnit/useRemoveUnit'
import { useSaveCashback } from '@pages/Settings/hooks/useSaveCashback/useSaveCashback'
import { useSaveSettings } from '@pages/Settings/hooks/useSaveSettings/useSaveSettings'
import { useSaveUnit } from '@pages/Settings/hooks/useSaveUnit/useSaveUnit'
import { useSetMainUnit } from '@pages/Settings/hooks/useSetMainUnit/useSetMainUnit'
import { useUnitDetail } from '@pages/Settings/hooks/useUnitDetail/useUnitDetail'
import { useUnitLimit } from '@pages/Settings/hooks/useUnitLimit/useUnitLimit'
import { useZoneMutations } from '@pages/Settings/hooks/useZoneMutations/useZoneMutations'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

export const useSettingsFacade = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const groups = useCompanyGroups()
  const units = groups.flatMap(({ units: list }) => list)

  return {
    unit,
    contact: {
      query: usePhones(unitId),
      mutations: usePhoneMutations(unitId),
    },
    delivery: {
      query: useDeliveryZones(unitId),
      location: useMapLocation(unitId),
      mutations: useZoneMutations(unitId),
    },
    service: { query: useSettings(unitId), save: useSaveSettings(unitId) },
    cashback: { save: useSaveCashback(unitId) },
    diningTables: {
      query: useDiningTables(unitId),
      mutations: useDiningTableMutations(unitId),
    },
    units: {
      groups,
      detail: useUnitDetail(unitId),
      limit: useUnitLimit(units.length),
      remove: useRemoveUnit(),
      save: useSaveUnit(unitId),
      setMain: useSetMainUnit(unitId),
    },
  }
}
