import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PaymentMethod } from '@custom_types/order'
import { SettingsService } from '@services/settings.service'

/** Sem forma configurada a loja não vende: dinheiro é o piso. */
const FALLBACK: PaymentMethod[] = ['CASH']

export const useAcceptedPayments = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: [...queryKeys.tenant.all(tenantId ?? ''), 'accepted-payments'],
    queryFn: () => SettingsService.getAcceptedPayments(tenantId as string),
    enabled: !!tenantId,
  })

  const methods = query.data?.acceptedPaymentMethods?.length
    ? query.data.acceptedPaymentMethods
    : FALLBACK

  return { ...query, methods }
}
