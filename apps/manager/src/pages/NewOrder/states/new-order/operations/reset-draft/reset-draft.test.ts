import { describe, expect, it, vi } from 'vitest'

import { NEW_ORDER_EMPTY_RECIPIENT } from '@pages/NewOrder/constants/new-order.constants'

import { resetDraft } from './reset-draft'
import { emptyDraftMock } from './reset-draft.mock'

describe('resetDraft', () => {
  it('clears the whole ticket back to a counter order', () => {
    const set = vi.fn()

    resetDraft(set)

    expect(set).toHaveBeenCalledWith({
      lines: [],
      channel: emptyDraftMock.channel,
      chosenMethod: null,
      recipient: NEW_ORDER_EMPTY_RECIPIENT,
      notes: emptyDraftMock.notes,
    })
  })
})
