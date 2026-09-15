import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'
import { clearRegisteredSession } from '@shared/services/session/session-bridge'

import { useSessionStore } from './session.state'
import { sessionStateMembershipsMock, sessionStateUserMock } from './session.state.mock'

vi.mock('@shared/services/auth/auth.service')

describe(useSessionStore.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionStore.getState().clear()
  })

  it('opens signed out, with nothing remembered', () => {
    const session = useSessionStore.getState()

    expect(session.user).toBeNull()
    expect(session.memberships).toEqual([])
    expect(session.currentUnitId).toBeNull()
  })

  it('stores the session and remembers the active unit', () => {
    useSessionStore
      .getState()
      .setSession(sessionStateUserMock, sessionStateMembershipsMock)
    useSessionStore.getState().setCurrentUnit('unit-1')

    expect(useSessionStore.getState().user).toBe(sessionStateUserMock)
    expect(useSessionStore.getState().currentUnitId).toBe('unit-1')
  })

  it('loads the session from the API when none is stored yet', async () => {
    vi.mocked(AuthService.me).mockResolvedValue({
      ...sessionStateUserMock,
      memberships: sessionStateMembershipsMock,
    })

    const user = await useSessionStore.getState().load()

    expect(user).toEqual(sessionStateUserMock)
    expect(useSessionStore.getState().memberships).toEqual(
      sessionStateMembershipsMock
    )
  })

  it('signs out back to an empty session', () => {
    useSessionStore
      .getState()
      .setSession(sessionStateUserMock, sessionStateMembershipsMock)

    useSessionStore.getState().clear()

    expect(useSessionStore.getState().user).toBeNull()
    expect(useSessionStore.getState().memberships).toEqual([])
    expect(useSessionStore.getState().currentUnitId).toBeNull()
  })

  it('registers its clear operation for infrastructure session expiry', () => {
    useSessionStore
      .getState()
      .setSession(sessionStateUserMock, sessionStateMembershipsMock)

    clearRegisteredSession()

    expect(useSessionStore.getState().user).toBeNull()
    expect(useSessionStore.getState().memberships).toEqual([])
  })
})
