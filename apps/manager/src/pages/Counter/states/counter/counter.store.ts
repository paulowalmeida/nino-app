import { create } from 'zustand'

import { addItem } from '@pages/Counter/states/counter/operations/add-item/add-item'
import { clearLastSale } from '@pages/Counter/states/counter/operations/clear-last-sale/clear-last-sale'
import { clearTicket } from '@pages/Counter/states/counter/operations/clear-ticket/clear-ticket'
import { setAddressLookupRequested } from '@pages/Counter/states/counter/operations/set-address-lookup-requested/set-address-lookup-requested'
import { setChangeFor } from '@pages/Counter/states/counter/operations/set-change-for/set-change-for'
import { setChannel } from '@pages/Counter/states/counter/operations/set-channel/set-channel'
import { setConsumerName } from '@pages/Counter/states/counter/operations/set-consumer-name/set-consumer-name'
import { setLastSale } from '@pages/Counter/states/counter/operations/set-last-sale/set-last-sale'
import { setPaymentMethod } from '@pages/Counter/states/counter/operations/set-payment-method/set-payment-method'
import { setRecipient } from '@pages/Counter/states/counter/operations/set-recipient/set-recipient'
import { setSheet } from '@pages/Counter/states/counter/operations/set-sheet/set-sheet'
import { setStep } from '@pages/Counter/states/counter/operations/set-step/set-step'
import { stepLine } from '@pages/Counter/states/counter/operations/step-line/step-line'
import type { CounterState } from '@pages/Counter/types/CounterState.type'

export const useCounterStore = create<CounterState>((set) => ({
  lines: [],
  sheet: false,
  step: 'items',
  channel: null,
  chosenPaymentMethod: null,
  consumerName: '',
  recipient: {
    name: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: '',
    city: '',
    state: '',
  },
  addressLookupRequested: false,
  changeFor: '',
  lastSale: null,
  add: (item, modifiers) => {
    addItem(set, item, modifiers)
    clearLastSale(set)
  },
  updateQuantity: (lineId, by) => stepLine(set, lineId, by),
  clear: () => clearTicket(set),
  setSheet: (sheet) => setSheet(set, sheet),
  setStep: (step) => setStep(set, step),
  setChannel: (channel) => setChannel(set, channel),
  setChosenPaymentMethod: (method) => setPaymentMethod(set, method),
  setConsumerName: (name) => setConsumerName(set, name),
  setRecipient: (patch) => {
    setRecipient(set, patch)
    if ('street' in patch || 'number' in patch) {
      setAddressLookupRequested(set, false)
    }
  },
  setAddressLookupRequested: (requested) =>
    setAddressLookupRequested(set, requested),
  setChangeFor: (value) => setChangeFor(set, value),
  setLastSale: (receipt) => setLastSale(set, receipt),
  clearLastSale: () => clearLastSale(set),
}))
