import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PublicTenantSettings } from '@shared/types/settings/public-tenant-settings'

/**
 * WHY: a loja que ainda não configurou nada continua vendendo por delivery —
 * o padrão do banco. Sem esse piso a tela leria "nenhum formato" e apagaria
 * uma etiqueta que deveria aparecer.
 */
const FALLBACK: OrderChannel[] = ['DELIVERY']

const enabledFormats = (settings: PublicTenantSettings): OrderChannel[] => {
  const formats: OrderChannel[] = []

  if (settings.isDeliveryEnabled) formats.push('DELIVERY')
  if (settings.isPickupEnabled) formats.push('PICKUP')
  if (settings.isCounterEnabled) formats.push('COUNTER')

  return formats.length ? formats : FALLBACK
}

export const useSalesFormats = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.tenant.publicSettings(tenantId ?? ''),
    queryFn: () => SettingsService.getPublicSettings(tenantId as string),
    enabled: !!tenantId,
  })

  const formats = query.data ? enabledFormats(query.data) : FALLBACK

  return {
    ...query,
    formats,
    preparationMinutes: query.data?.preparationMinutes ?? 30,
  }
}
