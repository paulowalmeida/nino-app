import type { Recipient } from '@pages/new-order/NewOrder.types'

export type RecipientFieldsProps = {
  value: Recipient
  zones: { value: string; label: string }[]
  onChange: (patch: Partial<Recipient>) => void
}
