import type { CashSession } from '@shared/types/cash/cash-session'

export const closedSessionDateKeyMock = '2026-08-29'

export const openSessionMock: CashSession = {
  id: 'session-1',
  unitId: 'unit-1',
  openedById: 'staff-1',
  openedByName: 'Ana',
  closedById: null,
  openingFloat: 100,
  salesTotal: 60,
  depositsTotal: 50,
  withdrawalsTotal: 30,
  expectedAmount: 180,
  countedAmount: null,
  difference: null,
  closingNote: null,
  openedAt: '2026-08-30T10:00:00.000Z',
  closedAt: null,
  movements: [
    {
      id: 'movement-1',
      kind: 'SALE',
      amount: 60,
      reason: null,
      orderId: 'order-1',
      createdAt: '2026-08-30T11:00:00.000Z',
    },
    {
      id: 'movement-2',
      kind: 'WITHDRAWAL',
      amount: 30,
      reason: 'Pagamento do gás',
      orderId: null,
      createdAt: '2026-08-30T12:00:00.000Z',
    },
  ],
}

export const closedSessionMock: CashSession = {
  ...openSessionMock,
  id: 'session-0',
  closedById: 'staff-2',
  countedAmount: 178,
  difference: -2,
  openedAt: '2026-08-29T10:00:00.000Z',
  closedAt: '2026-08-29T22:00:00.000Z',
}
