import type { Tab } from '@shared/types/tab/tab'

export const openTabMock: Tab = {
  id: 'tab-1',
  unitId: 'unit-1',
  status: 'OPEN',
  label: 'Mesa 4',
  subtotal: 36,
  totalAmount: 36,
  openedByUserId: 'user-1',
  closedAt: null,
  finalizedAt: null,
  cancelledAt: null,
  cancelReason: null,
  createdAt: '2026-10-19T12:00:00.000Z',
  updatedAt: '2026-10-19T12:30:00.000Z',
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      productName: 'Pastel de queijo',
      quantity: 2,
      unitPrice: 18,
      notes: null,
      isCancelled: false,
      cancelledAt: null,
      modifiers: [],
    },
    {
      id: 'item-2',
      productId: 'product-2',
      productName: 'Caldo de cana',
      quantity: 1,
      unitPrice: 9,
      notes: 'sem gelo',
      isCancelled: true,
      cancelledAt: '2026-10-19T12:20:00.000Z',
      modifiers: [],
    },
  ],
  payment: null,
  statusHistory: [
    {
      status: 'OPEN',
      changedById: 'user-1',
      createdAt: '2026-10-19T12:00:00.000Z',
    },
  ],
}

export const awaitingPaymentTabMock: Tab = {
  ...openTabMock,
  id: 'tab-2',
  status: 'AWAITING_PAYMENT',
  label: 'Mesa 7',
  closedAt: '2026-10-19T13:00:00.000Z',
}

export const paidTabMock: Tab = {
  ...awaitingPaymentTabMock,
  id: 'tab-3',
  status: 'FINALIZED',
  label: 'Ana Souza',
  finalizedAt: '2026-10-19T13:10:00.000Z',
  payment: {
    id: 'payment-1',
    method: 'CASH',
    amount: 36,
    changeAmount: 14,
    paidAt: '2026-10-19T13:10:00.000Z',
  },
}

export const cancelledTabMock: Tab = {
  ...openTabMock,
  id: 'tab-4',
  status: 'FINALIZED',
  label: 'Mesa 2',
  finalizedAt: '2026-10-19T13:15:00.000Z',
  cancelledAt: '2026-10-19T13:15:00.000Z',
  cancelReason: 'Cliente saiu sem consumir',
}
