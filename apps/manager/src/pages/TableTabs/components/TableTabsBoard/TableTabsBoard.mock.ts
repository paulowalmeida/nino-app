import {
  awaitingPaymentTabMock,
  cancelledTabMock,
  openTabMock,
  paidTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tableTabsBoardMock = {
  activeTabs: [openTabMock, awaitingPaymentTabMock],
  finalizedTabs: [paidTabMock, cancelledTabMock],
  searchLabel: 'Buscar comandas por mesa ou nome',
}
