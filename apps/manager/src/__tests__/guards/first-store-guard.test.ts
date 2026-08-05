import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthUser } from '@custom_types/auth/auth-user'
import type { Membership } from '@custom_types/auth/membership'
import { FirstStoreGuard } from '@guards/first-store-guard'
import { useSessionStore } from '@states/useSessionStore'

const me = vi.hoisted(() => vi.fn())

vi.mock('@services/auth.service', () => ({ AuthService: { me } }))

const USER: AuthUser = {
  id: 'u1',
  name: 'Weskley',
  phone: '11987654321',
  isActive: true,
  lastLoginAt: null,
  profileCompletedAt: '2026-08-01T12:00:00.000Z',
  locale: null,
  timezone: null,
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
  credentials: [],
}

const membership = (): Membership => ({
  tenantId: 't1',
  tenantName: 'Burgão do Nino — Centro',
  tenantSlug: 'burgao-centro',
  companyId: 'c1',
  companyName: 'Burgão do Nino LTDA',
  role: 'TENANT_OWNER',
  isCurrent: true,
})

const locationOf = (result: unknown) =>
  (result as Response).headers.get('location')

describe('FirstStoreGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionStore.getState().clear()
  })

  it('sends a visitor without a session to the login screen', async () => {
    me.mockRejectedValue(new Error('no session'))

    expect(locationOf(await FirstStoreGuard())).toBe('/entrar')
  })

  it('opens the screen for an account with no store yet', async () => {
    useSessionStore.getState().setSession(USER, [])

    expect(await FirstStoreGuard()).toBeNull()
  })

  it('sends a merchant who already has a store back to the panel', async () => {
    useSessionStore.getState().setSession(USER, [membership()])

    expect(locationOf(await FirstStoreGuard())).toBe('/')
  })
})
