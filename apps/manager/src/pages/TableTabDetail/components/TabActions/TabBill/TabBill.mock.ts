import { awaitingPaymentTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabBillMock = {
  feeTab: {
    ...awaitingPaymentTabMock,
    serviceFeePercent: 10,
    serviceFeeAmount: 3.6,
    totalAmount: 39.6,
    remainingAmount: 39.6,
  },
  declinedFeeTab: awaitingPaymentTabMock,
  partlyPaidFeeTab: {
    ...awaitingPaymentTabMock,
    serviceFeePercent: 10,
    serviceFeeAmount: 3.6,
    totalAmount: 39.6,
    paidAmount: 20,
    remainingAmount: 19.6,
    payments: [
      {
        id: 'payment-1',
        method: 'PIX' as const,
        amount: 20,
        changeAmount: null,
        paidAt: '2026-10-19T13:05:00.000Z',
      },
    ],
  },
  serviceFeeLabel: 'Serviço (10%)',
}
