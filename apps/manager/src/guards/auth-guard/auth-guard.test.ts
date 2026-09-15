import { type LoaderFunctionArgs, RouterContextProvider } from 'react-router'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'

import { AuthGuard } from './auth-guard'
import { authGuardMembershipMock, authGuardUserMock } from './auth-guard.mock'

const createSessionState = (
  user: SessionState['user'],
  memberships: SessionState['memberships']
): SessionState => ({
  user,
  memberships,
  currentUnitId: null,
  setSession: vi.fn(),
  setCurrentUnit: vi.fn(),
  clear: vi.fn(),
  load: vi.fn().mockResolvedValue(user),
})

const loaderArgs = (unitId: string): LoaderFunctionArgs => ({
  request: new Request(`https://manager.test/${unitId}/balcao`),
  url: new URL(`https://manager.test/${unitId}/balcao`),
  pattern: '/:unitId/balcao',
  params: { unitId },
  context: new RouterContextProvider(),
})

afterEach(() => vi.restoreAllMocks())

describe('AuthGuard', () => {
  it('redirects an unauthenticated visitor to sign in', async () => {
    const session = createSessionState(null, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await AuthGuard(loaderArgs('unit-1'))

    expect(result?.headers.get('Location')).toBe('/entrar')
    expect(session.setCurrentUnit).not.toHaveBeenCalled()
  })

  it('redirects an authenticated visitor without membership to the root', async () => {
    const session = createSessionState(authGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await AuthGuard(loaderArgs('unit-1'))

    expect(result?.headers.get('Location')).toBe('/')
    expect(session.setCurrentUnit).not.toHaveBeenCalled()
  })

  it('selects the authorized unit before rendering its route', async () => {
    const session = createSessionState(authGuardUserMock, [
      authGuardMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await AuthGuard(loaderArgs(authGuardMembershipMock.unitId))

    expect(result).toBeNull()
    expect(session.setCurrentUnit).toHaveBeenCalledWith(
      authGuardMembershipMock.unitId
    )
  })
})
