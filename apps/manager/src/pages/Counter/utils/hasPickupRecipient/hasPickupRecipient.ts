import type { Recipient } from '@shared/types/order/recipient'

export const hasPickupRecipient = (recipient: Recipient): boolean =>
  [recipient.name, recipient.phone].every((value) => Boolean(value?.trim()))
