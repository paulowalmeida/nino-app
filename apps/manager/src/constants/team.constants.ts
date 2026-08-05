import type { TenantRole } from '@custom_types/auth/tenant-role'

export const TEAM_ROLE_LABEL: Record<TenantRole, string> = {
  TENANT_OWNER: 'Dono',
  MANAGER: 'Gerente',
  STAFF: 'Atendente',
}

/**
 * What each role can do, said in one line: whoever changes it needs to know
 * what they're handing over, and "manager" alone doesn't explain anything.
 */
export const TEAM_ROLE_OPTIONS = [
  {
    value: 'TENANT_OWNER' as const,
    label: 'Dono',
    hint: 'Tudo, inclusive assinatura e equipe',
  },
  {
    value: 'MANAGER' as const,
    label: 'Gerente',
    hint: 'Dia a dia e configurações da loja',
  },
  {
    value: 'STAFF' as const,
    label: 'Atendente',
    hint: 'Vê e move pedidos',
  },
]

/** Three people: a whole small team, which is the common case. */
export const TEAM_ROSTER_GHOST_ROWS = ['first', 'second', 'third']
