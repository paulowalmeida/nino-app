import type { Recipient } from '@shared/types/order/recipient'

import { hasValidRecipientIdentity } from '../hasValidRecipientIdentity/hasValidRecipientIdentity'

export const hasPickupRecipient = (recipient: Recipient): boolean =>
  hasValidRecipientIdentity(recipient)
