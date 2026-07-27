import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Select } from '@nino/ds/components/Select'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Textarea } from '@nino/ds/components/Textarea'
import { BackLink } from '@components/BackLink'
import { ItemThumb } from '@components/ItemThumb'
import { PageTitle } from '@components/PageTitle'
import { RecipientFields } from '@compositions/RecipientFields'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useDeliveryZones } from '@hooks/settings/useDeliveryZones'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { useMenu } from '@hooks/product/useMenu'
import type { OrderChannel, PaymentMethod } from '@custom_types/order'
import { brl } from '@utils/money'
import { toE164 } from '@utils/phone'
import { CHANNEL_LABEL, paymentLabelFor } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'
import { isStoreOpen } from '@utils/store-open'

import type { CartLine, Recipient } from './NewOrder.types'

import styles from './NewOrder.module.css'
import motion from '@styles/motion.module.css'

const CHANNELS: OrderChannel[] = ['COUNTER', 'PICKUP', 'DELIVERY']

const EMPTY_RECIPIENT: Recipient = {
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  zoneId: '',
}

export const NewOrder = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { sections, isPending } = useMenu(tenantId)
  const { zones } = useDeliveryZones(tenantId)
  const { hours } = useOpeningHours(tenantId)
  const { methods } = useAcceptedPayments(tenantId)
  const { data: pause } = usePause(tenantId)
  const { mutateAsync: placeOrder, isPending: isPlacing } =
    useCreateOrder(tenantId)

  const [lines, setLines] = useState<CartLine[]>([])
  const [channel, setChannel] = useState<OrderChannel>('COUNTER')
  const [chosenMethod, setChosenMethod] = useState<PaymentMethod | null>(null)

  /** A forma escolhida só vale enquanto a loja aceitar. */
  const method =
    chosenMethod && methods.includes(chosenMethod) ? chosenMethod : methods[0]
  const [recipient, setRecipient] = useState<Recipient>(EMPTY_RECIPIENT)
  const [notes, setNotes] = useState('')
  const [failed, setFailed] = useState(false)

  const isDelivery = channel === 'DELIVERY'

  /**
   * O balcão atende quem está na porta a qualquer hora; a entrega, não. O
   * aviso informa e deixa a decisão com quem está atendendo — bloquear
   * seria pior no dia em que o entregador ainda está na rua.
   */
  const zone = tenant?.tenantId
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : undefined
  const closedNow =
    pause?.isPaused || (hours.length > 0 && !isStoreOpen(hours, zone ?? 'UTC'))

  const zoneOptions = zones
    .filter(({ isActive }) => isActive)
    .map(({ id, name, fee }) => ({
      value: id,
      label: `${name} · ${brl(fee)}`,
    }))

  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.quantity,
    0
  )

  const fee = isDelivery
    ? Number(zones.find(({ id }) => id === recipient.zoneId)?.fee ?? 0)
    : 0

  const missingRecipient =
    isDelivery &&
    (!recipient.name || !recipient.phone || !recipient.street ||
      !recipient.zoneId)

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
        guestName: recipient.name || undefined,
        guestPhone: recipient.phone ? toE164(recipient.phone) : undefined,
        ...(isDelivery
          ? {
              deliveryZoneId: recipient.zoneId,
              guestStreet: recipient.street,
              guestNumber: recipient.number || undefined,
              guestComplement: recipient.complement || undefined,
              guestNeighborhood: recipient.neighborhood || undefined,
            }
          : {}),
      })
      void navigate(`../${order.id}`, { relative: 'path' })
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className={styles.page}>
      <BackLink>Pedidos</BackLink>

      <header className={styles.header}>
        <PageTitle accent="mão">Pedido na mão</PageTitle>
        <p className={styles.subtitle}>
          Para quem pediu no balcão ou ligou para a loja. O pedido entra na
          fila do mesmo jeito que o do app.
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
            <EmptyState>
              O cardápio está vazio. Cadastre um item antes de abrir pedido.
            </EmptyState>
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
            <EmptyState>
              Nada na comanda ainda. Toque em Adicionar no item do cardápio.
            </EmptyState>
          )}

          {lines.length > 0 && (
            <ul className={styles.lines}>
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className={`${motion.deal} ${styles.line}`}
                >
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

          {isDelivery && fee > 0 && (
            <div className={styles.feeRow}>
              <span>Entrega</span>
              <span>{brl(fee)}</span>
            </div>
          )}

          <div className={styles.total}>
            <span>Total</span>
            <span>{brl(subtotal + fee)}</span>
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

          <RecipientFields
            value={recipient}
            zones={zoneOptions}
            withAddress={isDelivery}
            onChange={(patch) =>
              setRecipient((current) => ({ ...current, ...patch }))
            }
          />

          <div className={styles.field}>
            <span className={styles.label} id="payment-label">
              Pagamento
            </span>
            <Select
              options={methods.map((value) => ({
                value,
                label: paymentLabelFor(value, channel),
              }))}
              value={method}
              aria-labelledby="payment-label"
              onValueChange={(value) => setChosenMethod(value as PaymentMethod)}
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

          {isDelivery && closedNow && (
            <Alert
              variant="warning"
              role="status"
              className={motion.unroll}
            >
              {pause?.isPaused
                ? 'A loja está fechada agora. O pedido entra assim mesmo.'
                : 'Fora do horário de entrega. O pedido entra assim mesmo.'}
            </Alert>
          )}

          {missingRecipient && lines.length > 0 && (
            <p className={styles.hint}>
              Para entregar, preencha nome, telefone, rua e região.
            </p>
          )}

          {failed && (
            <Alert variant="error">
              Não foi possível abrir o pedido. Tente de novo.
            </Alert>
          )}

          <Button
            loading={isPlacing}
            disabled={lines.length === 0 || missingRecipient}
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
