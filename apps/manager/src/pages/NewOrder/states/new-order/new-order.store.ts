import { create } from 'zustand'

import { NEW_ORDER_EMPTY_RECIPIENT } from '@pages/NewOrder/constants/new-order.constants'
import { addLine } from '@pages/NewOrder/states/new-order/operations/add-line/add-line'
import { resetDraft } from '@pages/NewOrder/states/new-order/operations/reset-draft/reset-draft'
import { setChannel } from '@pages/NewOrder/states/new-order/operations/set-channel/set-channel'
import { setChosenMethod } from '@pages/NewOrder/states/new-order/operations/set-chosen-method/set-chosen-method'
import { setNotes } from '@pages/NewOrder/states/new-order/operations/set-notes/set-notes'
import { setRecipient } from '@pages/NewOrder/states/new-order/operations/set-recipient/set-recipient'
import { stepLine } from '@pages/NewOrder/states/new-order/operations/step-line/step-line'
import type { NewOrderState } from '@pages/NewOrder/types/NewOrderState.type'

export const useNewOrderStore = create<NewOrderState>((set) => ({
  lines: [],
  channel: 'COUNTER',
  chosenMethod: null,
  recipient: NEW_ORDER_EMPTY_RECIPIENT,
  notes: '',
  setChannel: (channel) => setChannel(set, channel),
  setChosenMethod: (chosenMethod) => setChosenMethod(set, chosenMethod),
  setRecipient: (patch) => setRecipient(set, patch),
  setNotes: (notes) => setNotes(set, notes),
  add: (line) => addLine(set, line),
  step: (productId, by) => stepLine(set, productId, by),
  reset: () => resetDraft(set),
}))
