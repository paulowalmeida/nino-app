import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'

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
    expect(session.currentTenantId).toBeNull()
  })

  it('stores the session and remembers the active tenant', () => {
    useSessionStore
      .getState()
      .setSession(sessionStateUserMock, sessionStateMembershipsMock)
    useSessionStore.getState().setCurrentTenant('tenant-1')

    expect(useSessionStore.getState().user).toBe(sessionStateUserMock)
    expect(useSessionStore.getState().currentTenantId).toBe('tenant-1')
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
    expect(useSessionStore.getState().currentTenantId).toBeNull()
  })
})
