import { useMutation } from '@tanstack/react-query'

import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import { downloadSaleReceipt } from '@pages/Counter/utils/downloadSaleReceipt/downloadSaleReceipt'
import { OrderService } from '@shared/services/order/order.service'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

export const useCounterReceipt = (unitId: string | null) => {
  const lastSale = useCounterStore((state) => state.lastSale)
  const dismissReceipt = useCounterStore((state) => state.clearLastSale)

  const { mutate: downloadReceipt, isPending: isDownloadingReceipt } =
    useMutation({
      mutationFn: (receipt: SaleReceipt) =>
        OrderService.downloadReceipt(unitId as string, receipt.orderId),
      onSuccess: (pdf, receipt) =>
        downloadSaleReceipt(
          pdf,
          `recibo-${ticketNumber(receipt.orderNumber)}.pdf`
        ),
      meta: { errorTitle: 'Recibo não foi gerado' },
    })

  return { lastSale, dismissReceipt, downloadReceipt, isDownloadingReceipt }
}
