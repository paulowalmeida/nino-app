import { useState } from 'react'

import { NinoLogo } from '@components/NinoLogo'
import { PersonMark } from '@components/PersonMark'
import { ProductGrid } from '@compositions/ProductGrid'
import { SaleTicket } from '@compositions/SaleTicket'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useMenu } from '@hooks/product/useMenu'
import type { CartLine } from '@custom_types/counter'
import type { MenuItem } from '@custom_types/product'
import type { OrderChannel, PaymentMethod } from '@custom_types/order'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Counter.module.css'
import motion from '@styles/motion.module.css'

export const Counter = () => {
  const user = useSessionStore(({ user }) => user)
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { sections, isPending } = useMenu(tenantId)
  const { mutateAsync: placeOrder, isPending: isSending } =
    useCreateOrder(tenantId)

  const [lines, setLines] = useState<CartLine[]>([])
  const [channel, setChannel] = useState<OrderChannel>('COUNTER')
  const [method, setMethod] = useState<PaymentMethod>('CASH')
  const [failed, setFailed] = useState(false)
  const [closed, setClosed] = useState<string | null>(null)

  const pick = (item: MenuItem) =>
    setLines((current) => {
      const found = current.find(({ productId }) => productId === item.id)
      if (!found) {
        return [
          ...current,
          {
            productId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: 1,
          },
        ]
      }
      return current.map((line) =>
        line.productId === item.id
          ? { ...line, quantity: line.quantity + 1 }
          : line
      )
    })

  const step = (productId: string, by: number) =>
    setLines((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + by }
            : line
        )
        .filter(({ quantity }) => quantity > 0)
    )

  /** Fechada a venda, o caixa volta limpo: a próxima pessoa já está na fila. */
  const finish = async () => {
    setFailed(false)
    try {
      const order = await placeOrder({
        channel,
        paymentMethod: method,
        items: lines.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice: Number(unitPrice),
        })),
      })
      setLines([])
      setClosed(order.id.slice(-4).toUpperCase())
      window.setTimeout(() => setClosed(null), 4000)
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className={styles.screen}>
      <header className={styles.bar}>
        <NinoLogo size="sm" tone="light" />
        <span className={styles.store}>{tenant?.tenantName}</span>
        <div className={styles.operator}>
          <PersonMark name={user?.name ?? ''} tone="night" size="sm" />
          <span className={styles.operatorName}>
            {user?.name.split(' ')[0]}
          </span>
        </div>
      </header>

      <main className={styles.floor}>
        <section className={styles.menu} aria-label="Cardápio">
          <ProductGrid
            sections={sections}
            isPending={isPending}
            onPick={pick}
          />
        </section>

        <SaleTicket
          lines={lines}
          channel={channel}
          method={method}
          isSending={isSending}
          failed={failed}
          onStep={step}
          onChannel={setChannel}
          onMethod={setMethod}
          onClear={() => setLines([])}
          onFinish={finish}
        />
      </main>

      {closed && (
        <p className={`${motion.land} ${styles.closed}`} role="status">
          Venda #{closed} fechada
        </p>
      )}
    </div>
  )
}
