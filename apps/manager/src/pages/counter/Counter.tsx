import { useState } from 'react'

import { ProductGrid } from '@compositions/ProductGrid'
import { SaleTicket } from '@compositions/SaleTicket'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useMenu } from '@hooks/product/useMenu'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { ApiError } from '@utils/api-error'
import type { CartLine } from '@custom_types/counter'
import type { MenuItem } from '@custom_types/product'
import type { PaymentMethod } from '@custom_types/order'

import styles from './Counter.module.css'
import motion from '@styles/motion.module.css'

/**
 * O balcão: atender quem está na loja sem passar pelo resto do painel.
 * Alvos grandes, comanda sempre à vista e tela limpa a cada venda — quem
 * opera aqui repete o mesmo gesto o expediente inteiro.
 */
export const Counter = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { sections, isPending } = useMenu(tenantId)
  const { methods } = useAcceptedPayments(tenantId)
  const { mutateAsync: placeOrder, isPending: isSending } =
    useCreateOrder(tenantId)

  const [lines, setLines] = useState<CartLine[]>([])
  const [chosen, setChosen] = useState<PaymentMethod | null>(null)

  /** A escolha só vale enquanto a loja aceitar aquela forma. */
  const method = chosen && methods.includes(chosen) ? chosen : methods[0]
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
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

  const finish = async () => {
    setError(null)
    if (!customerName && !tableNumber) {
      setError('Informe o nome do cliente ou o número da mesa.')
      return
    }
    try {
      const order = await placeOrder({
        channel: 'COUNTER',
        paymentMethod: method,
        guestName: customerName || undefined,
        tableNumber: tableNumber || undefined,
        items: lines.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice: Number(unitPrice),
        })),
      })
      setLines([])
      setCustomerName('')
      setTableNumber('')
      setClosed(order.id.slice(-4).toUpperCase())
      window.setTimeout(() => setClosed(null), 4000)
    } catch (caught) {
      if (caught instanceof ApiError && caught.status < 500) {
        setError(caught.message)
        return
      }
      setError('Não foi possível fechar a venda. Tente de novo.')
    }
  }

  return (
    <div className={styles.page}>
      <header className={`${motion.deal} ${styles.header}`}>
        <h1 className={styles.title}>Balcão</h1>
        <p className={styles.subtitle}>
          Monte o pedido de quem está na loja e feche a venda.
        </p>
      </header>

      <div className={styles.floor}>
        <section className={styles.menu} aria-label="Cardápio">
          <ProductGrid
            sections={sections}
            isPending={isPending}
            onPick={pick}
          />
        </section>

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
          onStep={step}
          onMethod={setChosen}
          onClear={() => {
            setLines([])
            setCustomerName('')
            setTableNumber('')
          }}
          onFinish={finish}
        />
      </div>

      {closed && (
        <p className={`${motion.land} ${styles.closed}`} role="status">
          Venda #{closed} fechada
        </p>
      )}
    </div>
  )
}
