import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const clearTicket = (set: SetCounterState) =>
  set({
    lines: [],
    sheet: false,
    step: 'items',
    channel: null,
    chosenPaymentMethod: null,
    consumerName: '',
    tableNumber: '',
    recipient: {
      name: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      zoneId: '',
    },
    changeFor: '',
  })
