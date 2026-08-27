import type { Order } from '@shared/types/order/order'

export const orderInProgressMock = {
  id: 'order-1',
  statusHistory: [
    {
      id: 'history-1',
      status: 'PENDING',
      createdAt: '2026-02-10T18:30:00.000Z',
    },
  ],
  cancelReason: null,
} as unknown as Order

export const cancelledOrderMock = {
  id: 'order-2',
  statusHistory: [],
  cancelReason: 'Cliente desistiu',
} as unknown as Order
