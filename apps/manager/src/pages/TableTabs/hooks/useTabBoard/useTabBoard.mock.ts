import {
  cancelledTabMock,
  openTabMock,
} from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabBoardMock = {
  unitId: 'unit-1',
  active: { tabs: [openTabMock], isPending: false, isError: false },
  finalized: { tabs: [cancelledTabMock], isPending: false, isError: false },
}
