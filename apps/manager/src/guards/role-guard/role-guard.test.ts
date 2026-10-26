import { type LoaderFunctionArgs, RouterContextProvider } from 'react-router'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'

import { roleGuard } from './role-guard'
import {
  roleGuardOwnerMembershipMock,
  roleGuardStaffMembershipMock,
  roleGuardUserMock,
} from './role-guard.mock'

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

describe('roleGuard', () => {
  it('redirects an unauthenticated visitor to sign in', async () => {
    const session = createSessionState(null, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await roleGuard(['UNIT_OWNER'])(loaderArgs('unit-owner'))

    expect(result?.headers.get('Location')).toBe('/entrar')
  })

  it('redirects a visitor without membership to the root', async () => {
    const session = createSessionState(roleGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await roleGuard(['UNIT_OWNER'])(loaderArgs('unit-owner'))

    expect(result?.headers.get('Location')).toBe('/')
  })

  it('sends a member to the home route for its role when access is denied', async () => {
    const session = createSessionState(roleGuardUserMock, [
      roleGuardStaffMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await roleGuard(['UNIT_OWNER'])(
      loaderArgs(roleGuardStaffMembershipMock.unitId)
    )

    expect(result?.headers.get('Location')).toBe('/unit-staff/balcao')
    expect(session.setCurrentUnit).not.toHaveBeenCalled()
  })

  it('selects the member unit when its role is allowed', async () => {
    const session = createSessionState(roleGuardUserMock, [
      roleGuardOwnerMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await roleGuard(['UNIT_OWNER'])(
      loaderArgs(roleGuardOwnerMembershipMock.unitId)
    )

    expect(result).toBeNull()
    expect(session.setCurrentUnit).toHaveBeenCalledWith(
      roleGuardOwnerMembershipMock.unitId
    )
  })
})
