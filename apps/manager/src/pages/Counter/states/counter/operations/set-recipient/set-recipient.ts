import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'
import type { Recipient } from '@shared/types/order/recipient'

export const setRecipient = (
  set: SetCounterState,
  patch: Partial<Recipient>
) => set((state) => ({ recipient: { ...state.recipient, ...patch } }))
