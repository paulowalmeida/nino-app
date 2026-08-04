import { RouterContextProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthUser, Membership } from '@custom_types/auth'
import { GuestGuard } from '@guards/guest-guard'
import { useSessionStore } from '@states/useSessionStore'

const me = vi.hoisted(() => vi.fn())
const clearDraft = vi.hoisted(() => vi.fn())

vi.mock('@services/auth.service', () => ({ AuthService: { me } }))
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
  useSessionStore.getState().setSession(USER, memberships)
}

const locationOf = (result: unknown) => (result as Response).headers.get('location')

describe('GuestGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    useSessionStore.getState().clear()
  })

  it('no session: opens the login screen without asking the API', async () => {
    expect(await visit('/entrar')).toBeNull()
    expect(me).not.toHaveBeenCalled()
  })

  it('no session: opens the signup wizard without asking the API', async () => {
    expect(await visit('/cadastrar')).toBeNull()
    expect(me).not.toHaveBeenCalled()
  })

  it('no session: keeps any draft it finds, having nothing to abandon', async () => {
    await visit('/entrar')

    expect(clearDraft).not.toHaveBeenCalled()
  })

  it('stale hint: opens the login screen', async () => {
    window.localStorage.setItem(HINT_KEY, '1')
    me.mockRejectedValue(new Error('stale hint'))

    expect(await visit('/entrar')).toBeNull()
  })

  it('stale hint: opens the signup wizard', async () => {
    window.localStorage.setItem(HINT_KEY, '1')
    me.mockRejectedValue(new Error('stale hint'))

    expect(await visit('/cadastrar')).toBeNull()
  })

  it('stale hint: keeps the draft, since nobody is signed in to abandon it', async () => {
    window.localStorage.setItem(HINT_KEY, '1')
    me.mockRejectedValue(new Error('stale hint'))
    await visit('/entrar')

    expect(clearDraft).not.toHaveBeenCalled()
  })

  it('has a store: sends the login screen back to the root', async () => {
    signedIn([membership()])

    expect(locationOf(await visit('/entrar'))).toBe('/')
  })

  it('has a store: sends the signup wizard back to the root', async () => {
    signedIn([membership()])

    expect(locationOf(await visit('/cadastrar'))).toBe('/')
  })

  it('has a store: keeps the store draft of a merchant who is not signing up', async () => {
    signedIn([membership()])
    await visit('/entrar')

    expect(clearDraft).not.toHaveBeenCalled()
  })

  it('store missing: sends the wizard to the units screen, where the store is born', async () => {
    signedIn([])

    expect(locationOf(await visit('/cadastrar'))).toBe('/unidades')
  })

  it('store missing: keeps the draft on the way to the units screen', async () => {
    signedIn([])
    await visit('/cadastrar')

    expect(clearDraft).not.toHaveBeenCalled()
  })

  it('store missing: stays on login when the person walks back to it', async () => {
    signedIn([])

    expect(await visit('/entrar')).toBeNull()
  })

  it('store missing: discards the store draft once login is reached', async () => {
    signedIn([])
    await visit('/entrar')

    expect(clearDraft).toHaveBeenCalledWith('first-store')
  })
})
