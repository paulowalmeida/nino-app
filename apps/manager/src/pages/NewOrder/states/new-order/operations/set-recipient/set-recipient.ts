import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'
import type { Recipient } from '@shared/types/order/recipient'

export const setRecipient = (
  set: SetNewOrderState,
  patch: Partial<Recipient>
) => set((current) => ({ recipient: { ...current.recipient, ...patch } }))
