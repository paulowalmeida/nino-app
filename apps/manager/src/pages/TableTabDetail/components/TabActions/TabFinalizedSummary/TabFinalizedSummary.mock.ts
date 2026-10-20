import {
  cancelledTabMock,
  paidTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabFinalizedSummaryMock = {
  paidTab: paidTabMock,
  serviceFeeTab: {
    ...paidTabMock,
    serviceFeePercent: 10,
    serviceFeeAmount: 3.6,
    totalAmount: 39.6,
    paidAmount: 39.6,
  },
  cancelledTab: cancelledTabMock,
}
