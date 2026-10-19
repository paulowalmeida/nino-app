import { paidTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabTransitionsScopeMock = { unitId: 'unit-1', tabId: 'tab-2' }
export const tabTransitionsPayRequestMock = {
  method: 'CASH' as const,
  amountReceived: 50,
}
export const tabTransitionsCancelRequestMock = {
  cancelReason: 'Cliente saiu sem consumir',
}
export const tabTransitionsTabMock = paidTabMock
