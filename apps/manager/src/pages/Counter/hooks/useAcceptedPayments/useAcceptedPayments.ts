import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { PaymentMethod } from '@shared/types/order/payment-method'

/** With no method configured the store can't sell: cash is the floor. */
const FALLBACK: PaymentMethod[] = ['CASH']

export const useAcceptedPayments = (unitId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.unit.publicSettings(unitId ?? ''),
    queryFn: () => SettingsService.getPublicSettings(unitId as string),
    enabled: !!unitId,
  })

  const methods = query.data?.acceptedPaymentMethods?.length
    ? query.data.acceptedPaymentMethods
    : FALLBACK

  return { ...query, methods }
}
