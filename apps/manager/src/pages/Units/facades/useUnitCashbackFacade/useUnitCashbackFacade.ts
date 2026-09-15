import { useSaveCashback } from '@pages/Units/hooks/useSaveCashback/useSaveCashback'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

export const useUnitCashbackFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null

  return {
    query: useSettings(unitId),
    save: useSaveCashback(unitId),
  }
}
