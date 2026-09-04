import type { Recipient } from '@shared/types/order/recipient'

export const hasPickupRecipient = (recipient: Recipient): boolean =>
  [
    recipient.name,
    recipient.phone,
    recipient.street,
    recipient.number,
    recipient.neighborhood,
    recipient.city,
    recipient.state,
  ].every((value) => Boolean(value?.trim()))
