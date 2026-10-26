import {
  awaitingPaymentTabMock,
  openTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tableTabCardMock = {
  openTab: openTabMock,
  awaitingPaymentTab: awaitingPaymentTabMock,
  singleItemTab: { ...openTabMock, items: [openTabMock.items[0]] },
  emptyTab: { ...openTabMock, items: [], totalAmount: 0 },
}
