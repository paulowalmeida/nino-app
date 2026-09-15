import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'

import { FirstStoreGuard } from './first-store-guard'
import {
  firstStoreGuardMembershipMock,
  firstStoreGuardUserMock,
} from './first-store-guard.mock'

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

afterEach(() => vi.restoreAllMocks())

describe('FirstStoreGuard', () => {
  it('redirects an unauthenticated visitor to sign in', async () => {
    const session = createSessionState(null, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await FirstStoreGuard()

    expect(result?.headers.get('Location')).toBe('/entrar')
  })

  it('redirects a user with a unit to the root', async () => {
    const session = createSessionState(firstStoreGuardUserMock, [
      firstStoreGuardMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await FirstStoreGuard()

    expect(result?.headers.get('Location')).toBe('/')
  })

  it('allows an authenticated user without units to create the first one', async () => {
    const session = createSessionState(firstStoreGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)

    const result = await FirstStoreGuard()

    expect(result).toBeNull()
  })
})
