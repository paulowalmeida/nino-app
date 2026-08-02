import { RouterContextProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthUser, Membership } from '@custom_types/auth'
import { useSessionStore } from '@states/useSessionStore'

import { GuestGuard } from './guest-guard'

const loadSession = vi.hoisted(() => vi.fn())
const clearDraft = vi.hoisted(() => vi.fn())

vi.mock('@services/auth/session.service', () => ({ loadSession }))
vi.mock('@utils/form-draft', () => ({ clearDraft }))

const HINT_KEY = 'nino.had-session'
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

/* O router entrega mais do que a guarda lê; montar o argumento inteiro evita
 * cast e quebra o teste se a assinatura mudar, que é o ponto de tê-lo. */
const visit = (pathname: string) => {
  const url = new URL(`http://localhost${pathname}`)

  return GuestGuard({
    request: new Request(url),
    url,
    pattern: pathname,
    params: {},
    context: new RouterContextProvider(),
  })
}

/** Browser carrying a session cookie worth asking the API about. */
const signedIn = (memberships: Membership[]) => {
  window.localStorage.setItem(HINT_KEY, '1')
  loadSession.mockResolvedValue(USER)
  useSessionStore.getState().setSession(USER, memberships)
}

const locationOf = (result: unknown) => (result as Response).headers.get('location')

describe('GuestGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    useSessionStore.getState().clear()
  })

  describe('visitor with no session', () => {
    it('opens the login screen without asking the API', async () => {
      expect(await visit('/entrar')).toBeNull()
      expect(loadSession).not.toHaveBeenCalled()
    })

    it('opens the signup wizard without asking the API', async () => {
      expect(await visit('/cadastrar')).toBeNull()
      expect(loadSession).not.toHaveBeenCalled()
    })

    it('keeps any draft it finds, having nothing to abandon', async () => {
      await visit('/entrar')

      expect(clearDraft).not.toHaveBeenCalled()
    })
  })

  describe('session remembered but already gone', () => {
    beforeEach(() => {
      window.localStorage.setItem(HINT_KEY, '1')
      loadSession.mockResolvedValue(null)
    })

    it('opens the login screen', async () => {
      expect(await visit('/entrar')).toBeNull()
    })

    it('opens the signup wizard', async () => {
      expect(await visit('/cadastrar')).toBeNull()
    })

    it('keeps the draft, since nobody is signed in to abandon it', async () => {
      await visit('/entrar')

      expect(clearDraft).not.toHaveBeenCalled()
    })
  })

  describe('signup finished, merchant already has a store', () => {
    beforeEach(() => signedIn([membership()]))

    it('sends the login screen back to the root', async () => {
      expect(locationOf(await visit('/entrar'))).toBe('/')
    })

    it('sends the signup wizard back to the root', async () => {
      expect(locationOf(await visit('/cadastrar'))).toBe('/')
    })

    it('keeps the store draft of a merchant who is not signing up', async () => {
      await visit('/entrar')

      expect(clearDraft).not.toHaveBeenCalled()
    })
  })

  describe('account created, store still missing', () => {
    beforeEach(() => signedIn([]))

    it('sends the wizard to the units screen, where the store is born', async () => {
      expect(locationOf(await visit('/cadastrar'))).toBe('/unidades')
    })

    it('keeps the draft on the way to the units screen', async () => {
      await visit('/cadastrar')

      expect(clearDraft).not.toHaveBeenCalled()
    })

    it('stays on login when the person walks back to it', async () => {
      expect(await visit('/entrar')).toBeNull()
    })

    it('discards the store draft once login is reached', async () => {
      await visit('/entrar')

      expect(clearDraft).toHaveBeenCalledWith('first-store')
    })
  })
})
