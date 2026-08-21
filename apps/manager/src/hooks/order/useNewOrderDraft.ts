import { useState } from 'react'

import type { CartLine } from '@custom_types/counter/cart-line'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { NEW_ORDER_EMPTY_RECIPIENT } from '@constants/order.constants'

type NewOrderDraft = {
  lines: CartLine[]
  subtotal: number
  channel: OrderChannel
  setChannel: (channel: OrderChannel) => void
  chosenMethod: PaymentMethod | null
  setChosenMethod: (method: PaymentMethod | null) => void
  recipient: Recipient
  setRecipient: (patch: Partial<Recipient>) => void
  notes: string
  setNotes: (notes: string) => void
  add: (line: Omit<CartLine, 'quantity'>) => void
  step: (productId: string, by: number) => void
}

export const useNewOrderDraft = (): NewOrderDraft => {
  const [lines, setLines] = useState<CartLine[]>([])
  const [channel, setChannel] = useState<OrderChannel>('COUNTER')
  const [chosenMethod, setChosenMethod] = useState<PaymentMethod | null>(null)
  const [recipient, setRecipient] = useState<Recipient>(
    NEW_ORDER_EMPTY_RECIPIENT
  )
  const [notes, setNotes] = useState('')

  const add = (line: Omit<CartLine, 'quantity'>) =>
    setLines((current) => {
      const found = current.find((item) => item.productId === line.productId)
      if (!found) return [...current, { ...line, quantity: 1 }]
      return current.map((item) =>
        item.productId === line.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
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

  return {
    lines,
    subtotal: lines.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0
    ),
    channel,
    setChannel,
    chosenMethod,
    setChosenMethod,
    recipient,
    setRecipient: (patch) =>
      setRecipient((current) => ({ ...current, ...patch })),
    notes,
    setNotes,
    add,
    step,
  }
}
