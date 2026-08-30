export const saleReceiptLinesMock = [
  { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 2 },
]

export const saleReceiptInputMock = {
  orderNumber: 128,
  lines: saleReceiptLinesMock,
  total: 20,
  paymentMethod: 'CASH' as const,
  changeFor: '50,00',
  closedAt: new Date('2026-08-30T12:00:00.000Z'),
}
