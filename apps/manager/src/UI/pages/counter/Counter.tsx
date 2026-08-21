import { useState } from 'react'

import { Drawer } from '@nino/ds/components/Drawer'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Grid } from '@nino/ds/components/Grid'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
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

import styles from './Counter.module.css'
import motion from '@styles/motion.module.css'

export const Counter = () => {
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
    <Flexbox className={styles.page}>
      <Flexbox
        as="header"
        direction="column"
        gap={1}
        shrink={false}
        mb={4}
        className={motion.deal}
      >
        <Heading level={1} size="xl">
          Balcão
        </Heading>
        <Text size="sm" color="subtle">
          Monte o pedido de quem está na loja e feche a venda.
        </Text>
      </Flexbox>

      <Grid columns={{ mobile: 1, desktop: 2 }} className={styles.floor}>
        <Flexbox as="section" className={styles.menu} aria-label="Cardápio">
          <ProductGrid sections={sections} isPending={isPending} onPick={add} />
        </Flexbox>

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
      </Grid>

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
    </Flexbox>
  )
}
