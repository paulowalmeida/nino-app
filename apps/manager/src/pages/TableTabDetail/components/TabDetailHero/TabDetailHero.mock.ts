import {
  awaitingPaymentTabMock,
  openTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabDetailHeroMock = {
  openTab: openTabMock,
  awaitingPaymentTab: awaitingPaymentTabMock,
  pluralTab: {
    ...openTabMock,
    items: [openTabMock.items[0], openTabMock.items[0]],
  },
}
