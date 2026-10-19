import {
  cancelledTabMock,
  paidTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabFinalizedSummaryMock = {
  paidTab: paidTabMock,
  exactPaymentTab: {
    ...paidTabMock,
    payment: { ...paidTabMock.payment!, changeAmount: null },
  },
  cancelledTab: cancelledTabMock,
}
