import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@elements/BackLink/BackLink'
import { NewOrderMenu } from '@compositions/NewOrderMenu/NewOrderMenu'
import { NewOrderTicket } from '@compositions/NewOrderTicket/NewOrderTicket'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useDeliveryZones } from '@hooks/settings/useDeliveryZones'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { useMenu } from '@hooks/product/useMenu'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { NEW_ORDER_EMPTY_RECIPIENT } from '@constants/order.constants'
import { brl } from '@utils/money'
import { toE164 } from '@utils/phone'
import { isStoreOpen } from '@utils/store-open'

import styles from './NewOrder.module.css'

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
  const [recipient, setRecipient] = useState<Recipient>(
    NEW_ORDER_EMPTY_RECIPIENT
  )
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
    (!recipient.name ||
      !recipient.phone ||
      !recipient.street ||
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

      <Header
        mt={4}
        mb={5}
        title="Pedido na mão"
        accent="mão"
        description="Para quem pediu no balcão ou ligou para a loja. O pedido entra na fila do mesmo jeito que o do app."
      />

      <div className={styles.columns}>
        <NewOrderMenu sections={sections} isPending={isPending} onAdd={add} />

        <NewOrderTicket
          lines={lines}
          subtotal={subtotal}
          fee={fee}
          channel={channel}
          onChannelChange={setChannel}
          method={method}
          methods={methods}
          onMethodChange={setChosenMethod}
          recipient={recipient}
          zoneOptions={zoneOptions}
          onRecipientChange={(patch) =>
            setRecipient((current) => ({ ...current, ...patch }))
          }
          notes={notes}
          onNotesChange={setNotes}
          isPaused={!!pause?.isPaused}
          closedNow={closedNow}
          missingRecipient={!!missingRecipient}
          failed={failed}
          isPlacing={isPlacing}
          onStep={step}
          onPlace={() => void handlePlace()}
        />
      </div>
    </div>
  )
}
