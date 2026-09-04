import { describe, expect, it } from 'vitest'

import type { CounterState } from '@pages/Counter/types/CounterState.type'
import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

import {
  recipientBeforeChangeMock,
  recipientPatchMock,
} from './set-recipient.mock'
import { setRecipient } from './set-recipient'

describe('setRecipient', () => {
  it('merges the recipient patch without dropping existing fields', () => {
    let nextState: Pick<CounterState, 'recipient'> = {
      recipient: recipientBeforeChangeMock,
    }
    const set: SetCounterState = (updater) => {
      if (typeof updater === 'function') {
        const patch = updater({
          recipient: recipientBeforeChangeMock,
        } as CounterState)
        nextState = {
          recipient: { ...nextState.recipient, ...patch.recipient },
        }
      }
    }
    setRecipient(set, recipientPatchMock)

    expect(nextState.recipient).toEqual({
      ...recipientBeforeChangeMock,
      ...recipientPatchMock,
    })
  })
})
