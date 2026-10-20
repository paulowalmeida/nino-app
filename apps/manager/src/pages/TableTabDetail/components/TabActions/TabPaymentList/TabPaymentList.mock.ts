import { paidTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabPaymentListMock = {
  splitTab: {
    ...paidTabMock,
    payments: [
      {
        id: 'payment-1',
        method: 'CASH' as const,
        amount: 20,
        changeAmount: 5,
        paidAt: '2026-10-19T13:05:00.000Z',
      },
      {
        id: 'payment-2',
        method: 'CARD_ON_DELIVERY' as const,
        amount: 16,
        changeAmount: null,
        paidAt: '2026-10-19T13:10:00.000Z',
      },
    ],
  },
  unpaidTab: { ...paidTabMock, payments: [] },
}
