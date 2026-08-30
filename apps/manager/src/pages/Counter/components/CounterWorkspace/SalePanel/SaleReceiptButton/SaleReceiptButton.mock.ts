import type { SaleReceiptButtonProps } from './SaleReceiptButton'

export const saleReceiptButtonMock: Omit<SaleReceiptButtonProps, 'onDismiss'> =
  {
    saleReceipt: {
      orderNumber: 128,
      closedAt: '2026-08-30T12:00:00.000Z',
      lines: [
        { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 2 },
      ],
      total: 20,
      paymentMethod: 'CASH',
      receivedAmount: 50,
      changeAmount: 30,
    },
  }
