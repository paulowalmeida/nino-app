import { create } from 'zustand'

import { addItem } from '@pages/Counter/states/counter/operations/add-item/add-item'
import { clearLastSale } from '@pages/Counter/states/counter/operations/clear-last-sale/clear-last-sale'
import { clearTicket } from '@pages/Counter/states/counter/operations/clear-ticket/clear-ticket'
import { setChangeFor } from '@pages/Counter/states/counter/operations/set-change-for/set-change-for'
import { setCustomerName } from '@pages/Counter/states/counter/operations/set-customer-name/set-customer-name'
import { setLastSale } from '@pages/Counter/states/counter/operations/set-last-sale/set-last-sale'
import { setPaymentMethod } from '@pages/Counter/states/counter/operations/set-payment-method/set-payment-method'
import { setSheet } from '@pages/Counter/states/counter/operations/set-sheet/set-sheet'
import { setTableNumber } from '@pages/Counter/states/counter/operations/set-table-number/set-table-number'
import { stepLine } from '@pages/Counter/states/counter/operations/step-line/step-line'
import type { CounterState } from '@pages/Counter/types/CounterState.type'

export const useCounterStore = create<CounterState>((set) => ({
  lines: [],
  sheet: false,
  chosenPaymentMethod: null,
  customerName: '',
  tableNumber: '',
  changeFor: '',
  lastSale: null,
  add: (item) => {
    addItem(set, item)
    clearLastSale(set)
  },
  step: (productId, by) => stepLine(set, productId, by),
  clear: () => clearTicket(set),
  setSheet: (sheet) => setSheet(set, sheet),
  setChosenPaymentMethod: (method) => setPaymentMethod(set, method),
  setCustomerName: (name) => setCustomerName(set, name),
  setTableNumber: (table) => setTableNumber(set, table),
  setChangeFor: (value) => setChangeFor(set, value),
  setLastSale: (receipt) => setLastSale(set, receipt),
  clearLastSale: () => clearLastSale(set),
}))
