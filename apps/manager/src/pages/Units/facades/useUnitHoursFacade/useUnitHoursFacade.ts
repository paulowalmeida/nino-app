import { useSaveWeek } from '@pages/Units/hooks/useSaveWeek/useSaveWeek'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useOpeningHours } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'

export const useUnitHoursFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null

  return {
    query: useOpeningHours(tenantId),
    save: useSaveWeek(tenantId),
  }
}
