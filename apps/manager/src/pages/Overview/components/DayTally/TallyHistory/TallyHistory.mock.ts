import { kitchenCardOrderMock } from '@shared/components/KitchenCard/KitchenCard.mock'
import type { Order } from '@shared/types/order/order'

export const tallyHistoryMock: { recent: Order[] } = {
  recent: [
    {
      ...kitchenCardOrderMock,
      id: 'order-1',
      status: 'ACCEPTED',
      createdAt: '2026-01-01T12:00:00.000Z',
    },
  ],
}
