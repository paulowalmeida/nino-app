import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PublicUnitSettings } from '@shared/types/settings/public-unit-settings'

/**
 * WHY: a loja que ainda não configurou nada continua vendendo por delivery —
 * o padrão do banco. Sem esse piso a tela leria "nenhum formato" e apagaria
 * uma etiqueta que deveria aparecer.
 */
const FALLBACK: OrderChannel[] = ['DELIVERY']

const enabledFormats = (settings: PublicUnitSettings): OrderChannel[] => {
  const formats: OrderChannel[] = []

  if (settings.isDeliveryEnabled) formats.push('DELIVERY')
  if (settings.isPickupEnabled) formats.push('PICKUP')
  if (settings.isCounterEnabled) formats.push('COUNTER')

  return formats.length ? formats : FALLBACK
}

export const useSalesFormats = (unitId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.unit.publicSettings(unitId ?? ''),
    queryFn: () => SettingsService.getPublicSettings(unitId as string),
    enabled: !!unitId,
  })

  const formats = query.data ? enabledFormats(query.data) : FALLBACK

  return {
    ...query,
    formats,
    preparationMinutes: query.data?.preparationMinutes ?? 30,
  }
}
