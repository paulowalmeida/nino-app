import type { SaleReceiptButtonProps } from './SaleReceiptButton'

export const saleReceiptButtonMock: Omit<
  SaleReceiptButtonProps,
  'onDismiss' | 'onDownload'
> = {
  saleReceipt: {
    orderId: 'order-128',
    orderNumber: 128,
  },
  isDownloading: false,
}
