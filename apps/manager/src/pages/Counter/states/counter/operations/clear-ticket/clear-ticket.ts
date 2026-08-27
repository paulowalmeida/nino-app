import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const clearTicket = (set: SetCounterState) =>
  set({
    lines: [],
    sheet: false,
    chosenPaymentMethod: null,
    customerName: '',
    tableNumber: '',
  })
