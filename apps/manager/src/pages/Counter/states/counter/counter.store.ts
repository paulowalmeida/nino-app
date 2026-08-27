import { create } from 'zustand'

import { addItem } from '@pages/Counter/states/counter/operations/add-item/add-item'
import { clearTicket } from '@pages/Counter/states/counter/operations/clear-ticket/clear-ticket'
import { setCustomerName } from '@pages/Counter/states/counter/operations/set-customer-name/set-customer-name'
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
  add: (item) => addItem(set, item),
  step: (productId, by) => stepLine(set, productId, by),
  clear: () => clearTicket(set),
  setSheet: (sheet) => setSheet(set, sheet),
  setChosenPaymentMethod: (method) => setPaymentMethod(set, method),
  setCustomerName: (name) => setCustomerName(set, name),
  setTableNumber: (table) => setTableNumber(set, table),
}))
