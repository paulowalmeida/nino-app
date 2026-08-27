import { describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'
import { forgetSession, rememberSession } from '@shared/utils/session-hint/session-hint'

import { loadSession } from './load-session'
import { loadSessionMembershipsMock, loadSessionUserMock } from './load-session.mock'

vi.mock('@shared/services/auth/auth.service')
vi.mock('@shared/utils/session-hint/session-hint')

describe(loadSession.name, () => {
  it('returns the user already in the store without asking the API', async () => {
    const get = vi.fn().mockReturnValue({ user: loadSessionUserMock })

    const result = await loadSession(get)

    expect(result).toBe(loadSessionUserMock)
    expect(AuthService.me).not.toHaveBeenCalled()
  })

  it('fetches and stores the session when there is none yet', async () => {
    const setSession = vi.fn()
    const get = vi.fn().mockReturnValue({ user: null, setSession })
    vi.mocked(AuthService.me).mockResolvedValue({
      ...loadSessionUserMock,
      memberships: loadSessionMembershipsMock,
    })

    const result = await loadSession(get)

    expect(setSession).toHaveBeenCalledWith(
      loadSessionUserMock,
      loadSessionMembershipsMock
    )
    expect(rememberSession).toHaveBeenCalled()
    expect(result).toEqual(loadSessionUserMock)
  })

  it('forgets the session hint when the API rejects the cookies', async () => {
    const get = vi.fn().mockReturnValue({ user: null, setSession: vi.fn() })
    vi.mocked(AuthService.me).mockRejectedValue(new Error('unauthorized'))

    const result = await loadSession(get)

    expect(forgetSession).toHaveBeenCalled()
    expect(result).toBeNull()
  })
})
