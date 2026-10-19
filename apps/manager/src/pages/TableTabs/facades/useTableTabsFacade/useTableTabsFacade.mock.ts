import { openTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tableTabsFacadeMock = {
  unitId: 'unit-1',
  board: {
    activeTabs: [openTabMock],
    finalizedTabs: [],
    isPending: false,
    isError: false,
  },
}
