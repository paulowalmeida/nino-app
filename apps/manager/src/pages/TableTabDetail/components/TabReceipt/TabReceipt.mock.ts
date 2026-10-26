import {
  awaitingPaymentTabMock,
  openTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabReceiptMock = {
  openTab: openTabMock,
  awaitingPaymentTab: awaitingPaymentTabMock,
  emptyTab: { ...openTabMock, items: [], totalAmount: 0 },
}
