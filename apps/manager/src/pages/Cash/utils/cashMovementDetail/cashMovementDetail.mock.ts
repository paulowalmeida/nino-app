import type { CashMovement } from '@shared/types/cash/cash-movement.type'

const counterSale: CashMovement = {
  id: 'movement-1',
  kind: 'SALE',
  amount: 24.9,
  reason: null,
  orderId: 'order-1',
  tabPaymentId: null,
  orderNumber: 123,
  tabLabel: null,
  createdAt: '2026-10-20T11:30:00.000Z',
}

export const cashMovementDetailMock = {
  counterSale,
  tabSale: {
    ...counterSale,
    orderId: null,
    orderNumber: null,
    tabPaymentId: 'payment-1',
    tabLabel: 'Mesa 4',
  },
  withdrawal: {
    ...counterSale,
    kind: 'WITHDRAWAL' as const,
    reason: 'Troco pro motoboy',
    orderId: null,
    orderNumber: null,
  },
  unknownSale: { ...counterSale, orderId: null, orderNumber: null },
}
