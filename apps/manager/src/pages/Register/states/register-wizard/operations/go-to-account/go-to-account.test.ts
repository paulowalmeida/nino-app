import { describe, expect, it, vi } from 'vitest'

import { goToAccount } from './go-to-account'
import { goToAccountMock } from './go-to-account.mock'

describe('goToAccount', () => {
  it('walks back to the account step without dropping what was typed', () => {
    const set = vi.fn()

    goToAccount(set)

    expect(set).toHaveBeenCalledWith({ step: goToAccountMock.expectedStep })
  })
})
