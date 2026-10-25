import type { ZoneOption } from '@pages/PromotionEditor/types/ZoneOption.type'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import { brl } from '@shared/utils/money/money'

const km = (value: number) => value.toLocaleString('pt-BR')

export const toZoneOptions = (zones: DeliveryZone[]): ZoneOption[] =>
  [...zones]
    .filter(({ isActive }) => isActive)
    .sort((left, right) => left.minRadiusKm - right.minRadiusKm)
    .map(({ id, minRadiusKm, maxRadiusKm, fee }) => ({
      value: id,
      label: `${km(minRadiusKm)} a ${km(maxRadiusKm)} km · taxa ${brl(fee)}`,
    }))
