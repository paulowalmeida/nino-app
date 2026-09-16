import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { useDeliveryLocation } from '../../hooks/useDeliveryLocation/useDeliveryLocation'

export const useSettingsUnitDetailFacade = (state: string) => {
  const units = useUnitsFacade()

  return {
    ...units,
    location: useDeliveryLocation(
      state,
      units.units.detail.data?.state ?? ''
    ),
  }
}
