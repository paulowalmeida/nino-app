import type { TenantRole } from '@custom_types/auth'

export type RosterEntry = {
  id: string
  name: string
  email: string | null
  /** Papel na loja ou situação — o que a pessoa é aqui dentro. */
  role: string
  /** Papel cru, quando a linha permite trocar de cargo. */
  roleKey?: TenantRole
  /** Motivo de o cargo estar travado, quando estiver. */
  roleLocked?: string
  /** Rota da ficha da pessoa. Sem isto, o nome não é link. */
  href?: string
  /** Last sign-in, ISO or null for an account that never signed in. */
  lastLoginAt: string | null
  /** Quiet mark for people who don't operate the panel. */
  quiet?: boolean
  removable: boolean
  /** Whether this entry's e-mail can be edited from the roster. */
  emailEditable?: boolean
}

export type TeamRosterProps = {
  /** Habilita a troca de cargo. Só dono da loja recebe isto. */
  onChangeRole?: (id: string, role: TenantRole) => void
  /** Linha com troca em andamento. */
  changingRoleId?: string
  title: string
  hint: string
  entries: RosterEntry[]
  empty: string
  isPending?: boolean
  removingId?: string
  onRemove: (id: string) => void
  onEditEmail?: (id: string) => void
}
