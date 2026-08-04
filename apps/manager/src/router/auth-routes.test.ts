import { describe, expect, it, vi } from 'vitest'

import { GuestGuard } from './guest-guard'
import { router } from './routes'

vi.mock('@services/auth.service', () => ({ AuthService: { me: vi.fn() } }))

const routeOf = (path: string) =>
  router.routes.flatMap((route) => route.children ?? [route]).find(
    (route) => route.path === path
  )

/**
 * A guarda desligada não quebra nada visível: a tela abre, e só quem já tem
 * sessão descobre — em produção — que login virou beco sem saída.
 */
describe('auth routes', () => {
  it('guards the login screen', () => {
    expect(routeOf('/entrar')?.loader).toBe(GuestGuard)
  })

  it('guards the signup wizard', () => {
    expect(routeOf('/cadastrar')?.loader).toBe(GuestGuard)
  })
})
