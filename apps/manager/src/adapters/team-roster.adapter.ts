import type { CourierMember } from '@custom_types/team/courier-member'
import type { RosterEntry } from '@custom_types/team/roster-entry'
import type { StaffMember } from '@custom_types/team/staff-member'
import { TEAM_ROLE_LABEL } from '@constants/team.constants'
import { loginEmailOf } from '@utils/login-email'

const OWN_ROLE_LOCKED = 'Você não pode mudar o próprio cargo'

export const staffRosterEntries = (
  members: StaffMember[],
  currentUserId: string | undefined
): RosterEntry[] =>
  members.map(({ user, role }) => ({
    id: user.id,
    name: user.name,
    email: loginEmailOf(user),
    role: TEAM_ROLE_LABEL[role],
    roleKey: role,
    roleLocked: user.id === currentUserId ? OWN_ROLE_LOCKED : undefined,
    lastLoginAt: user.lastLoginAt,
    removable: role !== 'TENANT_OWNER',
    emailEditable: true,
    href: user.id,
  }))

export const courierRosterEntries = (
  members: CourierMember[]
): RosterEntry[] =>
  members.map(({ courier, isActive }) => ({
    id: courier.id,
    name: courier.name,
    email: loginEmailOf(courier),
    role: isActive ? 'Ativo' : 'Parado',
    lastLoginAt: courier.lastLoginAt,
    quiet: true,
    removable: true,
  }))
