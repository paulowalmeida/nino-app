import { type LoaderFunctionArgs, RouterContextProvider } from 'react-router'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { STORE_DRAFT_KEY } from '@shared/constants/store-draft.constants'
import { useSessionStore } from '@shared/states/session/session.state'
import type { SessionState } from '@shared/types/session/session-state'
import { rememberSession } from '@shared/utils/session-hint/session-hint'

import { GuestGuard } from './guest-guard'
import {
  guestGuardMembershipMock,
  guestGuardUserMock,
} from './guest-guard.mock'

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

const loaderArgs = (pathname: string): LoaderFunctionArgs => ({
  request: new Request(`https://manager.test${pathname}`),
  url: new URL(`https://manager.test${pathname}`),
  pattern: pathname,
  params: {},
  context: new RouterContextProvider(),
})

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('GuestGuard', () => {
  it('skips the session request when there is no session hint', async () => {
    const getState = vi.spyOn(useSessionStore, 'getState')

    const result = await GuestGuard(loaderArgs('/entrar'))

    expect(result).toBeNull()
    expect(getState).not.toHaveBeenCalled()
  })

  it('keeps the public route when the session hint is stale', async () => {
    const session = createSessionState(null, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)
    rememberSession()

    const result = await GuestGuard(loaderArgs('/entrar'))

    expect(result).toBeNull()
  })

  it('redirects a signed-in user with a unit to the root', async () => {
    const session = createSessionState(guestGuardUserMock, [
      guestGuardMembershipMock,
    ])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)
    rememberSession()

    const result = await GuestGuard(loaderArgs('/entrar'))

    expect(result?.headers.get('Location')).toBe('/')
  })

  it('sends a signed-in user without a unit to the first-unit flow', async () => {
    const session = createSessionState(guestGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)
    rememberSession()

    const result = await GuestGuard(loaderArgs('/cadastrar'))

    expect(result?.headers.get('Location')).toBe('/unidades')
  })

  it('clears the abandoned unit draft on the sign-in route', async () => {
    const session = createSessionState(guestGuardUserMock, [])
    vi.spyOn(useSessionStore, 'getState').mockReturnValue(session)
    rememberSession()
    window.localStorage.setItem(`nino.draft.${STORE_DRAFT_KEY}`, '{}')

    const result = await GuestGuard(loaderArgs('/entrar'))

    expect(result).toBeNull()
    expect(
      window.localStorage.getItem(`nino.draft.${STORE_DRAFT_KEY}`)
    ).toBeNull()
  })
})
