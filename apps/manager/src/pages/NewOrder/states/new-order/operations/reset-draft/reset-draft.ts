import { NEW_ORDER_EMPTY_RECIPIENT } from '@pages/NewOrder/constants/new-order.constants'
import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'

export const resetDraft = (set: SetNewOrderState) =>
  set({
    lines: [],
    channel: 'COUNTER',
    chosenMethod: null,
    recipient: NEW_ORDER_EMPTY_RECIPIENT,
    notes: '',
  })
