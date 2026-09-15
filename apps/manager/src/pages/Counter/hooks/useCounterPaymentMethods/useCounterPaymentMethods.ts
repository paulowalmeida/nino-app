import { useAcceptedPayments } from '@pages/Counter/hooks/useAcceptedPayments/useAcceptedPayments'
import type { PaymentMethod } from '@shared/types/order/payment-method'

const isAvailableAtCounter = (method: PaymentMethod): boolean =>
  method === 'CASH'

export const useCounterPaymentMethods = (unitId: string | null) => {
  const payments = useAcceptedPayments(unitId)

  return {
    ...payments,
    methods: payments.methods.filter(isAvailableAtCounter),
  }
}
