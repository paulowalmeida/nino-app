import { describe, expect, it, vi } from 'vitest'

import { setSession } from './set-session'
import { setSessionMembershipsMock, setSessionUserMock } from './set-session.mock'

describe(setSession.name, () => {
  it('stores the signed-in user with their memberships', () => {
    const set = vi.fn()

    setSession(set, setSessionUserMock, setSessionMembershipsMock)

    expect(set).toHaveBeenCalledWith({
      user: setSessionUserMock,
      memberships: setSessionMembershipsMock,
    })
  })
})
