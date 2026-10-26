import { openTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabsScopeMock = {
  unitId: 'unit-1',
  statuses: ['OPEN', 'AWAITING_PAYMENT'] as const,
}

export const tabsPageMock = {
  data: [openTabMock],
  pagination: { page: 1, size: 40, total: 1 },
}
