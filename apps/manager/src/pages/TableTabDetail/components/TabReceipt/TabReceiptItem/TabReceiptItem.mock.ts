import type { TabItem } from '@shared/types/tab/tab-item'

export const tabReceiptActiveItemMock: TabItem = {
  id: 'item-1',
  productId: 'product-1',
  productName: 'Pastel de queijo',
  quantity: 2,
  unitPrice: 18,
  notes: 'bem passado',
  isCancelled: false,
  cancelledAt: null,
  modifiers: [
    { id: 'm-1', optionId: 'o-1', name: 'Bacon', quantity: 1, unitPrice: 3 },
    { id: 'm-2', optionId: 'o-2', name: 'Catupiry', quantity: 2, unitPrice: 2 },
  ],
}

export const tabReceiptCancelledItemMock: TabItem = {
  ...tabReceiptActiveItemMock,
  id: 'item-2',
  notes: null,
  modifiers: [],
  isCancelled: true,
  cancelledAt: '2026-10-19T12:20:00.000Z',
}
