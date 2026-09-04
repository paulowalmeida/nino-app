import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { useDeliveryLocation } from '../../hooks/useDeliveryLocation/useDeliveryLocation'

export const useSettingsUnitDetailFacade = (state: string) => ({
  ...useUnitsFacade(),
  location: useDeliveryLocation(state),
})
