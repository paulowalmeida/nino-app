import { useSaveCashback } from '@pages/Units/hooks/useSaveCashback/useSaveCashback'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

export const useUnitCashbackFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null

  return {
    query: useSettings(tenantId),
    save: useSaveCashback(tenantId),
  }
}
