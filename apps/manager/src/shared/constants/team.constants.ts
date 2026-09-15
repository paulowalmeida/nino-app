import type { UnitRole } from '@shared/types/auth/unit-role'

export const TEAM_ROLE_LABEL: Record<UnitRole, string> = {
  UNIT_OWNER: 'Dono',
  MANAGER: 'Gerente',
  STAFF: 'Atendente',
}

export const TEAM_ROLE_OPTIONS = [
  { value: 'UNIT_OWNER' as const, label: 'Dono', hint: 'Tudo, inclusive assinatura e equipe' },
  { value: 'MANAGER' as const, label: 'Gerente', hint: 'Dia a dia e configurações da loja' },
  { value: 'STAFF' as const, label: 'Atendente', hint: 'Vê e move pedidos' },
]
