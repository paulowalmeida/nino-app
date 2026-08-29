import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { PaymentMethod } from '@shared/types/order/payment-method'

/** With no method configured the store can't sell: cash is the floor. */
const FALLBACK: PaymentMethod[] = ['CASH']

export const useAcceptedPayments = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.tenant.publicSettings(tenantId ?? ''),
    queryFn: () => SettingsService.getPublicSettings(tenantId as string),
    enabled: !!tenantId,
  })

  const methods = query.data?.acceptedPaymentMethods?.length
    ? query.data.acceptedPaymentMethods
    : FALLBACK

  return { ...query, methods }
}
