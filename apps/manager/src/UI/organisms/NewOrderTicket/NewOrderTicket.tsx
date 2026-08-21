import { Box } from '@nino/ds/components/Box'
import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { Select } from '@nino/ds/components/Select'
import { Textarea } from '@nino/ds/components/Textarea'
import { RecipientFields } from '@organisms/RecipientFields/RecipientFields'
import {
  CHANNEL_LABEL,
  NEW_ORDER_TICKET_CHANNELS,
} from '@constants/order.constants'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { brl } from '@utils/money'
import { paymentLabelFor } from '@utils/order-flow'

import styles from './NewOrderTicket.module.css'
import motion from '@styles/motion.module.css'

export type NewOrderTicketProps = {
  lines: CartLine[]
  subtotal: number
  fee: number
  channel: OrderChannel
  onChannelChange: (channel: OrderChannel) => void
  method: PaymentMethod
  methods: PaymentMethod[]
  onMethodChange: (method: PaymentMethod) => void
  recipient: Recipient
  zoneOptions: { value: string; label: string }[]
  onRecipientChange: (patch: Partial<Recipient>) => void
  notes: string
  onNotesChange: (notes: string) => void
  isPaused: boolean
  closedNow: boolean
  missingRecipient: boolean
  failed: boolean
  isPlacing: boolean
  onStep: (productId: string, by: number) => void
  onPlace: () => void
}

export const NewOrderTicket = ({
  lines,
  subtotal,
  fee,
  channel,
  onChannelChange,
  method,
  methods,
  onMethodChange,
  recipient,
  zoneOptions,
  onRecipientChange,
  notes,
  onNotesChange,
  isPaused,
  closedNow,
  missingRecipient,
  failed,
  isPlacing,
  onStep,
  onPlace,
}: NewOrderTicketProps) => {
  const isDelivery = channel === 'DELIVERY'

  return (
    <aside className={styles.ticket}>
      <h2 className={styles.ticketTitle}>A comanda</h2>

      {lines.length === 0 && (
        <EmptyState>
          Nada na comanda ainda. Toque em Adicionar no item do cardápio.
        </EmptyState>
      )}

      {lines.length > 0 && (
        <Box as="ul" direction="column">
          {lines.map((line) => (
            <li
              key={line.productId}
              className={`${motion.deal} ${styles.line}`}
            >
              <span className={styles.lineName}>{line.name}</span>
              <Box gap={1} align="center" shrink={false}>
                <Button
                  size="icon"
                  variant="outline"
                  className={styles.stepButton}
                  aria-label={`Tirar um ${line.name}`}
                  onClick={() => onStep(line.productId, -1)}
                >
                  <Icon name="minus" />
                </Button>
                <span className={styles.quantity}>{line.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className={styles.stepButton}
                  aria-label={`Mais um ${line.name}`}
                  onClick={() => onStep(line.productId, 1)}
                >
                  <Icon name="plus" />
                </Button>
              </Box>
              <span className={styles.linePrice}>
                {brl(Number(line.unitPrice) * line.quantity)}
              </span>
            </li>
          ))}
        </Box>
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

      <Box direction="column" gap={1.5}>
        <span className={styles.label} id="channel-label">
          Como sai
        </span>
        <Select
          options={NEW_ORDER_TICKET_CHANNELS.map((value) => ({
            value,
            label: CHANNEL_LABEL[value],
          }))}
          value={channel}
          aria-labelledby="channel-label"
          onValueChange={(value) => onChannelChange(value as OrderChannel)}
        />
      </Box>

      <RecipientFields
        value={recipient}
        zones={zoneOptions}
        hasAddress={isDelivery}
        onChange={onRecipientChange}
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
          onValueChange={(value) => onMethodChange(value as PaymentMethod)}
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
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </div>

      {isDelivery && closedNow && (
        <Alert variant="warning" role="status" className={motion.unroll}>
          {isPaused
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
        onClick={onPlace}
      >
        Abrir pedido
      </Button>
    </aside>
  )
}
