import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

export const useStoreServiceFee = (unitId: string | null) => {
  const { data: settings } = useSettings(unitId)
  const storeServiceFeePercent = settings?.serviceFeeEnabled
    ? settings.serviceFeePercent
    : 0
  return { storeServiceFeePercent }
}
