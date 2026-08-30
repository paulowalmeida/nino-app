import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'

export const cashReceiptMock: SaleReceipt = {
  orderNumber: 128,
  closedAt: '2026-08-30T12:00:00.000Z',
  lines: [{ productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 2 }],
  total: 20,
  paymentMethod: 'CASH',
  receivedAmount: 50,
  changeAmount: 30,
}

export const pixReceiptMock: SaleReceipt = {
  ...cashReceiptMock,
  paymentMethod: 'PIX',
  receivedAmount: null,
  changeAmount: 0,
}
