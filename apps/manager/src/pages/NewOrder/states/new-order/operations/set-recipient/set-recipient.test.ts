import { describe, expect, it, vi } from 'vitest'

import type { NewOrderState } from '@pages/NewOrder/types/NewOrderState.type'

import { setRecipient } from './set-recipient'
import { currentRecipientMock, recipientPatchMock } from './set-recipient.mock'

describe('setRecipient', () => {
  it('patches one field and keeps the rest of who receives', () => {
    const set = vi.fn()

    setRecipient(set, recipientPatchMock)
    const transition = set.mock.calls[0][0] as (
      current: NewOrderState
    ) => Partial<NewOrderState>
    const { recipient } = transition({
      recipient: currentRecipientMock,
    } as NewOrderState)

    expect(recipient).toEqual({ ...currentRecipientMock, number: '56' })
  })
})
