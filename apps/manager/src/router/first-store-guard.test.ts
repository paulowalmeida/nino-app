import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthUser, Membership } from '@custom_types/auth'
import { useSessionStore } from '@states/useSessionStore'

import { FirstStoreGuard } from './first-store-guard'

const loadSession = vi.hoisted(() => vi.fn())

vi.mock('@services/auth/session.service', () => ({ loadSession }))

const USER = { id: 'u1', name: 'Weskley' } as AuthUser

const membership = (): Membership =>
  ({ tenantId: 't1', companyId: 'c1', role: 'OWNER' }) as Membership

const locationOf = (result: unknown) =>
  (result as Response).headers.get('location')

describe('FirstStoreGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionStore.getState().clear()
  })

  it('sends a visitor without a session to the login screen', async () => {
    loadSession.mockResolvedValue(null)

    expect(locationOf(await FirstStoreGuard())).toBe('/entrar')
  })

  it('opens the screen for an account with no store yet', async () => {
    loadSession.mockResolvedValue(USER)
    useSessionStore.getState().setSession(USER, [])

    expect(await FirstStoreGuard()).toBeNull()
  })

  it('sends a merchant who already has a store back to the panel', async () => {
    loadSession.mockResolvedValue(USER)
    useSessionStore.getState().setSession(USER, [membership()])

    expect(locationOf(await FirstStoreGuard())).toBe('/')
  })
})
