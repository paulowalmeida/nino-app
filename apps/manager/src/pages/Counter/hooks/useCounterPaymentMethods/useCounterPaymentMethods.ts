import { useAcceptedPayments } from '@pages/Counter/hooks/useAcceptedPayments/useAcceptedPayments'
import type { PaymentMethod } from '@shared/types/order/payment-method'

const isAvailableAtCounter = (method: PaymentMethod): boolean =>
  method !== 'CARD_ONLINE'

export const useCounterPaymentMethods = (tenantId: string | null) => {
  const payments = useAcceptedPayments(tenantId)

  return {
    ...payments,
    methods: payments.methods.filter(isAvailableAtCounter),
  }
}
