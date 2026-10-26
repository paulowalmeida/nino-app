import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { AuthService } from '@shared/services/auth/auth.service'
import { forgetSession, rememberSession } from '@shared/utils/session-hint/session-hint'

import { invalidatePendingSessionLoad, loadSession } from './load-session'
import { loadSessionMembershipsMock, loadSessionUserMock } from './load-session.mock'

vi.mock('@shared/services/auth/auth.service')
vi.mock('@shared/utils/session-hint/session-hint')

describe(loadSession.name, () => {
  beforeEach(() => vi.clearAllMocks())

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

  it('shares an in-flight session request between concurrent loaders', async () => {
    vi.clearAllMocks()
    const setSession = vi.fn()
    const get = vi.fn().mockReturnValue({ user: null, setSession })
    let resolveSession: (value: {
      id: string
      name: string
      memberships: typeof loadSessionMembershipsMock
    }) => void = () => undefined
    vi.mocked(AuthService.me).mockReturnValue(
      new Promise((resolve) => {
        resolveSession = resolve
      })
    )

    const first = loadSession(get)
    const second = loadSession(get)
    resolveSession({
      ...loadSessionUserMock,
      memberships: loadSessionMembershipsMock,
    })

    await expect(Promise.all([first, second])).resolves.toEqual([
      loadSessionUserMock,
      loadSessionUserMock,
    ])
    expect(AuthService.me).toHaveBeenCalledTimes(1)
  })

  it('forgets the session hint when the API rejects the cookies', async () => {
    const get = vi.fn().mockReturnValue({ user: null, setSession: vi.fn() })
    vi.mocked(AuthService.me).mockRejectedValue(new ApiError(401, 'unauthorized'))

    const result = await loadSession(get)

    expect(forgetSession).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('does not log out on a transient API failure', async () => {
    const get = vi.fn().mockReturnValue({ user: null, setSession: vi.fn() })
    vi.mocked(AuthService.me).mockRejectedValue(new ApiError(503, 'unavailable'))

    await expect(loadSession(get)).rejects.toThrow('unavailable')
    expect(forgetSession).not.toHaveBeenCalled()
  })

  it('ignores a late response after the session has been cleared', async () => {
    const setSession = vi.fn()
    const get = vi.fn().mockReturnValue({ user: null, setSession })
    let resolveSession: (value: {
      id: string
      name: string
      memberships: typeof loadSessionMembershipsMock
    }) => void = () => undefined
    vi.mocked(AuthService.me).mockReturnValue(
      new Promise((resolve) => {
        resolveSession = resolve
      })
    )

    const loading = loadSession(get)
    invalidatePendingSessionLoad()
    resolveSession({
      ...loadSessionUserMock,
      memberships: loadSessionMembershipsMock,
    })

    await expect(loading).resolves.toBeNull()
    expect(setSession).not.toHaveBeenCalled()
  })
})
