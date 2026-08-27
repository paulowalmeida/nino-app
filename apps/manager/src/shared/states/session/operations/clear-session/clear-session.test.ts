import { describe, expect, it, vi } from 'vitest'

import { clearSession } from './clear-session'
import { clearSessionMock } from './clear-session.mock'

describe(clearSession.name, () => {
  it('wipes the session back to signed-out', () => {
    const set = vi.fn()

    clearSession(set)

    expect(set).toHaveBeenCalledWith(clearSessionMock.emptyState)
  })
})
