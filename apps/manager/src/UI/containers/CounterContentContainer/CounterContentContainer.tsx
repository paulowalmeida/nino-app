import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Drawer } from '@nino/ds/components/Drawer'
import { toast } from '@nino/ds/components/Toast'
import { CouponTab } from '@organisms/CouponTab/CouponTab'
import { ProductGrid } from '@organisms/ProductGrid/ProductGrid'
import { SaleTicket } from '@organisms/SaleTicket/SaleTicket'
import { useCounterCart } from '@hooks/counter/useCounterCart'
import { useCounterSale } from '@hooks/counter/useCounterSale'
import { useMenu } from '@hooks/product/useMenu'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { useIsDesktop } from '@hooks/ui/useIsDesktop'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import { paymentMethodsFor, ticketNumber } from '@utils/order-flow'

import styles from './CounterContentContainer.module.css'

export const CounterContentContainer = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { sections, isPending } = useMenu(tenantId)
  const { methods: acceptedMethods } = useAcceptedPayments(tenantId)
  const methods = paymentMethodsFor(acceptedMethods, 'COUNTER')
  const { lines, count, total, add, step, clear } = useCounterCart()
  const { error, isSending, sell } = useCounterSale(tenantId)
  const isDesktop = useIsDesktop()
  const [sheet, setSheet] = useState(false)
  const [chosen, setChosen] = useState<PaymentMethod | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const method = chosen && methods.includes(chosen) ? chosen : methods[0]

  const emptyTicket = () => {
    clear()
    setSheet(false)
    setCustomerName('')
    setTableNumber('')
  }

  const handleStep = (productId: string, by: number) => {
    const line = lines.find((current) => current.productId === productId)
    const isRemovingLastLine =
      lines.length === 1 && line && line.quantity + by <= 0

    if (isRemovingLastLine) setSheet(false)
    step(productId, by)
  }

  const finish = async () => {
    const orderId = await sell({
      lines,
      paymentMethod: method,
      customerName,
      tableNumber,
    })

    if (!orderId) return

    emptyTicket()
    toast.success(`Venda #${ticketNumber(orderId)} fechada`)
  }

  return (
    <>
      <Box className={styles.floor}>
        <Box as="section" className={styles.menu} aria-label="Cardápio">
          <ProductGrid sections={sections} isPending={isPending} onPick={add} />
        </Box>

        {isDesktop && (
          <SaleTicket
            lines={lines}
            methods={methods}
            customerName={customerName}
            tableNumber={tableNumber}
            onCustomerName={setCustomerName}
            onTableNumber={setTableNumber}
            method={method}
            isSending={isSending}
            error={error}
            onStep={handleStep}
            onMethod={setChosen}
            onClear={emptyTicket}
            onFinish={finish}
          />
        )}
      </Box>

      {!isDesktop && count > 0 && (
        <CouponTab count={count} total={total} onOpen={() => setSheet(true)} />
      )}

      <Drawer
        open={sheet && !isDesktop && count > 0}
        onOpenChange={setSheet}
        placement="bottom"
        size="auto"
        title="Comanda"
        description={`${count} ${count === 1 ? 'item' : 'itens'}`}
        contentClassName={styles.sheet}
        bodyClassName={styles.sheetBody}
      >
        <SaleTicket
          bare
          lines={lines}
          methods={methods}
          customerName={customerName}
          tableNumber={tableNumber}
          onCustomerName={setCustomerName}
          onTableNumber={setTableNumber}
          method={method}
          isSending={isSending}
          error={error}
          onStep={handleStep}
          onMethod={setChosen}
          onClear={emptyTicket}
          onFinish={finish}
        />
      </Drawer>
    </>
  )
}
