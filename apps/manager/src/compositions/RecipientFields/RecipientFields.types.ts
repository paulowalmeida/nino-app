import type { Recipient } from '@pages/new-order/NewOrder.types'

export type RecipientFieldsProps = {
  value: Recipient
  zones: { value: string; label: string }[]
  /** Entrega precisa de endereço e zona; balcão e retirada, só do contato. */
  withAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
}
