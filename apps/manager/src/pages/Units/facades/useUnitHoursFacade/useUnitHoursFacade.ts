import { useSaveWeek } from '@pages/Units/hooks/useSaveWeek/useSaveWeek'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useOpeningHours } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'

export const useUnitHoursFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null

  return {
    query: useOpeningHours(unitId),
    save: useSaveWeek(unitId),
  }
}
