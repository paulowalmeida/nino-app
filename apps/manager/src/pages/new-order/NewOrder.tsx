import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button, Select, Skeleton, Textarea } from '@nino/ds'

import { Eyebrow } from '@components/Eyebrow'
import { ItemThumb } from '@components/ItemThumb'
import { PageTitle } from '@components/PageTitle'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useMenu } from '@hooks/product/useMenu'
import type { OrderChannel, PaymentMethod } from '@custom_types/order'
import { brl } from '@utils/money'
import { CHANNEL_LABEL, PAYMENT_METHOD_LABEL } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'

import type { CartLine } from './NewOrder.types'

import styles from './NewOrder.module.css'
import motion from '@styles/motion.module.css'

const CHANNELS: OrderChannel[] = ['COUNTER', 'PICKUP']

const METHODS: PaymentMethod[] = ['CASH', 'CARD_ON_DELIVERY']

export const NewOrder = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { sections, isPending } = useMenu(tenantId)
  const { mutateAsync: placeOrder, isPending: isPlacing } =
    useCreateOrder(tenantId)

  const [lines, setLines] = useState<CartLine[]>([])
  const [channel, setChannel] = useState<OrderChannel>('COUNTER')
  const [method, setMethod] = useState<PaymentMethod>('CASH')
  const [notes, setNotes] = useState('')
  const [failed, setFailed] = useState(false)

  const total = lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.quantity,
    0
  )

  const add = (line: Omit<CartLine, 'quantity'>) =>
    setLines((current) => {
      const found = current.find((it) => it.productId === line.productId)
      if (!found) return [...current, { ...line, quantity: 1 }]
      return current.map((it) =>
        it.productId === line.productId
          ? { ...it, quantity: it.quantity + 1 }
          : it
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

  const handlePlace = async () => {
    setFailed(false)
    try {
      const order = await placeOrder({
        channel,
        paymentMethod: method,
        notes: notes || undefined,
        items: lines.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice: Number(unitPrice),
        })),
      })
      void navigate(`../${order.id}`, { relative: 'path' })
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className={styles.page}>
      <Link to=".." relative="path" className={styles.backLink}>
        <span aria-hidden="true">←</span> Pedidos
      </Link>

      <header className={styles.header}>
        <Eyebrow>Pedidos</Eyebrow>
        <PageTitle accent="balcão">Pedido no balcão</PageTitle>
        <p className={styles.subtitle}>
          Monte a comanda de quem pediu na loja. O pedido entra na fila já
          aceito pela cozinha.
        </p>
      </header>

      <div className={styles.columns}>
        <section className={styles.menu} aria-label="Cardápio">
          {isPending && (
            <>
              <Skeleton className={styles.skeletonRow} />
              <Skeleton className={styles.skeletonRow} />
            </>
          )}

          {!isPending && sections.length === 0 && (
            <p className={styles.notice}>
              O cardápio está vazio. Cadastre um item antes de abrir pedido.
            </p>
          )}

          {sections.map(({ id, name, items }, sectionIndex) => (
            <div key={id} className={styles.section}>
              <h2
                className={`${motion.unroll} ${styles.sectionName}`}
                style={riseDelay(sectionIndex * 70)}
              >
                {name}
              </h2>

              <ul className={styles.items}>
                {items
                  .filter(({ isActive }) => isActive)
                  .map((item, index) => (
                    <li
                      key={item.id}
                      className={`${motion.deal} ${styles.item}`}
                      style={riseDelay(sectionIndex * 70 + index * 40 + 50)}
                    >
                      <ItemThumb
                        name={item.name}
                        imageUrl={item.images?.[0]?.url}
                      />
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>
                        {brl(item.price)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Adicionar ${item.name}`}
                        className={motion.press}
                        onClick={() =>
                          add({
                            productId: item.id,
                            name: item.name,
                            unitPrice: item.price,
                          })
                        }
                      >
                        Adicionar
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>

        <aside className={styles.ticket}>
          <h2 className={styles.ticketTitle}>A comanda</h2>

          {lines.length === 0 && (
            <p className={styles.empty}>
              Nada na comanda ainda. Toque em Adicionar no item do cardápio.
            </p>
          )}

          {lines.length > 0 && (
            <ul className={styles.lines}>
              {lines.map((line) => (
                <li key={line.productId} className={`${motion.deal} ${styles.line}`}>
                  <span className={styles.lineName}>{line.name}</span>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepButton}
                      aria-label={`Tirar um ${line.name}`}
                      onClick={() => step(line.productId, -1)}
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{line.quantity}</span>
                    <button
                      type="button"
                      className={styles.stepButton}
                      aria-label={`Mais um ${line.name}`}
                      onClick={() => step(line.productId, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.linePrice}>
                    {brl(Number(line.unitPrice) * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.total}>
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label} id="channel-label">
              Como sai
            </span>
            <Select
              options={CHANNELS.map((value) => ({
                value,
                label: CHANNEL_LABEL[value],
              }))}
              value={channel}
              aria-labelledby="channel-label"
              onValueChange={(value) => setChannel(value as OrderChannel)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label} id="payment-label">
              Pagamento
            </span>
            <Select
              options={METHODS.map((value) => ({
                value,
                label: PAYMENT_METHOD_LABEL[value],
              }))}
              value={method}
              aria-labelledby="payment-label"
              onValueChange={(value) => setMethod(value as PaymentMethod)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="notes">
              Observação
            </label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Sem cebola, ponto da carne…"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {failed && (
            <p className={styles.error}>
              Não foi possível abrir o pedido. Tente de novo.
            </p>
          )}

          <Button
            loading={isPlacing}
            disabled={lines.length === 0}
            className={`${motion.press} ${styles.place}`}
            onClick={handlePlace}
          >
            Abrir pedido
          </Button>
        </aside>
      </div>
    </div>
  )
}
