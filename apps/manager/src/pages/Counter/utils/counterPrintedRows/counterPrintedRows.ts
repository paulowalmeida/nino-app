import { COUNTER_CHANNEL_HINT } from '@pages/Counter/constants/counter.constants'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { Recipient } from '@shared/types/order/recipient'
import { brl } from '@shared/utils/money/money'

export type PrintedRow = { label: string; value: string }

type PrintedRowsParams = {
  channel: OrderChannel | null
  customerName: string
  tableNumber: string
  recipient: Recipient
  method: PaymentMethod | null
  changeFor: string
  changeAmount: number
}

const addressLine = ({ street, number, complement }: Recipient): string => {
  let line = street.trim()
  if (number.trim()) line += `, ${number.trim()}`
  if (complement.trim()) line += ` — ${complement.trim()}`
  return line
}

/**
 * As linhas que saem impressas no papel do pedido. A zona de entrega fica de
 * fora de propósito: ela é como a taxa foi calculada, não o que o cliente
 * confere.
 */
const paymentRow = (
  channel: OrderChannel | null,
  method: PaymentMethod,
  changeFor: string,
  changeAmount: number
): PrintedRow => {
  if (method === 'CARD_ON_DELIVERY' && channel === 'DELIVERY') {
    return { label: 'Pagamento', value: 'Cartão na entrega' }
  }

  const label = PAYMENT_METHOD_LABEL[method]
  if (method !== 'CASH' || !changeFor) return { label: 'Pagamento', value: label }

  const change = changeAmount > 0 ? `troco de ${brl(changeAmount)}` : 'sem troco'
  return { label: 'Pagamento', value: `${label} · ${change}` }
}

export const counterPrintedRows = ({
  channel,
  customerName,
  tableNumber,
  recipient,
  method,
  changeFor,
  changeAmount,
}: PrintedRowsParams): PrintedRow[] => {
  if (!channel) return []

  const rows: PrintedRow[] = [
    { label: 'Como sai', value: COUNTER_CHANNEL_HINT[channel] },
  ]
  const name = customerName.trim()
  const table = tableNumber.trim()

  if (channel === 'DELIVERY') {
    const who = [name, recipient.phone.trim()].filter(Boolean).join(' · ')
    if (who) rows.push({ label: 'Quem recebe', value: who })

    if (recipient.street.trim()) {
      const district = recipient.neighborhood.trim()
      rows.push({
        label: 'Endereço',
        value: addressLine(recipient) + (district ? `, ${district}` : ''),
      })
    }
  } else if (channel === 'COUNTER') {
    if (table || name) {
      rows.push({
        label: 'Identificação',
        value: table ? `Mesa ${table}${name ? ` · ${name}` : ''}` : name,
      })
    }
  } else if (name) {
    rows.push({ label: 'Chamar por', value: name })
  }

  if (method) {
    rows.push(paymentRow(channel, method, changeFor, changeAmount))
  }

  return rows
}
