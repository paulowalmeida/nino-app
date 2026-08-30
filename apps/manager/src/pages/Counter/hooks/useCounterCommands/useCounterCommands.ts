import { toast } from '@nino/ds/components/Toast'
import { toSaleReceipt } from '@pages/Counter/adapters/sale-receipt.adapter/sale-receipt.adapter'
import { useCounterCart } from '@pages/Counter/hooks/useCounterCart/useCounterCart'
import { useCounterSale } from '@pages/Counter/hooks/useCounterSale/useCounterSale'
import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

export const useCounterCommands = (
  tenantId: string | null,
  method: PaymentMethod | null
) => {
  const { lines, total, step } = useCounterCart()
  const { error, isSending, sell, reset } = useCounterSale(tenantId)
  const clear = useCounterStore((state) => state.clear)
  const setSheet = useCounterStore((state) => state.setSheet)
  const setLastSale = useCounterStore((state) => state.setLastSale)
  const customerName = useCounterStore((state) => state.customerName)
  const tableNumber = useCounterStore((state) => state.tableNumber)
  const changeFor = useCounterStore((state) => state.changeFor)

  const emptyTicket = () => {
    clear()
    reset()
  }

  const handleStep = (productId: string, by: number) => {
    const line = lines.find((current) => current.productId === productId)
    if (lines.length === 1 && line && line.quantity + by <= 0) setSheet(false)
    step(productId, by)
  }

  const finish = async () => {
    if (!method) return
    const orderNumber = await sell({
      lines,
      paymentMethod: method,
      customerName,
      tableNumber,
      changeFor,
    })
    if (!orderNumber) return
    setLastSale(
      toSaleReceipt({
        orderNumber,
        lines,
        total,
        paymentMethod: method,
        changeFor,
        closedAt: new Date(),
      })
    )
    emptyTicket()
    toast.success(`Venda #${ticketNumber(orderNumber)} fechada`)
  }

  return { error, isSending, handleStep, emptyTicket, finish }
}
