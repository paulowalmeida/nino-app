import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'

import { SessionGuard } from './session-guard'
import { sessionGuardUserMock } from './session-guard.mock'

const createSessionState = (user: SessionState['user']): SessionState => ({
  user,
  memberships: [],
  currentUnitId: null,
  setSession: vi.fn(),
  setCurrentUnit: vi.fn(),
  clear: vi.fn(),
  load: vi.fn().mockResolvedValue(user),
})

afterEach(() => vi.restoreAllMocks())

describe('SessionGuard', () => {
  it('redirects a visitor without a session to sign in', async () => {
    const session = createSessionState(null)
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await SessionGuard()

    expect(result?.headers.get('Location')).toBe('/entrar')
  })

  it('allows a visitor with a live session', async () => {
    const session = createSessionState(sessionGuardUserMock)
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await SessionGuard()

    expect(result).toBeNull()
  })
})
