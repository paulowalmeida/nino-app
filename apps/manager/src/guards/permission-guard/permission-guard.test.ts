import { type LoaderFunctionArgs, RouterContextProvider } from 'react-router'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'

import { permissionGuard } from './permission-guard'
import {
  permissionGuardCounterMembershipMock,
  permissionGuardManagerMembershipMock,
  permissionGuardUserMock,
} from './permission-guard.mock'

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
  request: new Request(`https://manager.test/${unitId}/produtos`),
  url: new URL(`https://manager.test/${unitId}/produtos`),
  pattern: '/:unitId/produtos',
  params: { unitId },
  context: new RouterContextProvider(),
})

afterEach(() => vi.restoreAllMocks())

describe('permissionGuard', () => {
  it('redirects an unauthenticated visitor to sign in', async () => {
    const session = createSessionState(null, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await permissionGuard('catalog.manage')(
      loaderArgs('unit-manager')
    )

    expect(result?.headers.get('Location')).toBe('/entrar')
  })

  it('redirects a visitor without membership to the root', async () => {
    const session = createSessionState(permissionGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await permissionGuard('catalog.manage')(
      loaderArgs('unit-manager')
    )

    expect(result?.headers.get('Location')).toBe('/')
  })

  it('sends a member without the permission to its home route', async () => {
    const session = createSessionState(permissionGuardUserMock, [
      permissionGuardCounterMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await permissionGuard('catalog.manage')(
      loaderArgs(permissionGuardCounterMembershipMock.unitId)
    )

    expect(result?.headers.get('Location')).toBe('/unit-counter/balcao')
    expect(session.setCurrentUnit).not.toHaveBeenCalled()
  })

  it('selects the member unit when the cargo grants the permission', async () => {
    const session = createSessionState(permissionGuardUserMock, [
      permissionGuardManagerMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await permissionGuard('catalog.manage')(
      loaderArgs(permissionGuardManagerMembershipMock.unitId)
    )

    expect(result).toBeNull()
    expect(session.setCurrentUnit).toHaveBeenCalledWith(
      permissionGuardManagerMembershipMock.unitId
    )
  })
})
