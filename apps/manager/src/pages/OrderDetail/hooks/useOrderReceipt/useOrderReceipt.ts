import { useMutation } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'
import { downloadSaleReceipt } from '@shared/utils/downloadSaleReceipt/downloadSaleReceipt'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

type ReceiptTarget = Pick<Order, 'id' | 'orderNumber'>

export const useOrderReceipt = (unitId: string | null) => {
  const { mutate: downloadReceipt, isPending: isDownloadingReceipt } =
    useMutation({
      mutationFn: (order: ReceiptTarget) =>
        OrderService.downloadReceipt(unitId as string, order.id),
      onSuccess: (pdf, order) =>
        downloadSaleReceipt(
          pdf,
          `recibo-${ticketNumber(order.orderNumber)}.pdf`
        ),
      meta: { errorTitle: 'Recibo não foi gerado' },
    })

  return { downloadReceipt, isDownloadingReceipt }
}
