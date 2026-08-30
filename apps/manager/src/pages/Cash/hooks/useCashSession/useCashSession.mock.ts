import type { CashSession } from '@shared/types/cash/cash-session'

export const openSessionMock: CashSession = {
  id: 'session-1',
  tenantId: 'tenant-1',
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
