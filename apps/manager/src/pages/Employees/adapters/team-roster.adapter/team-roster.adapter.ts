import type { CourierMember } from '@shared/types/team/courier-member'
import type { RosterEntry } from '@shared/types/team/roster-entry'
import type { StaffMember } from '@shared/types/team/staff-member'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import { promotionTargets } from '@shared/utils/assignable-positions/assignable-positions'
import { loginEmailOf } from '@shared/utils/login-email/login-email'

const OWN_ROLE_LOCKED = 'Você não pode mudar o próprio cargo'

export const staffRosterEntries = (
  members: StaffMember[],
  currentUserId: string | undefined,
  assignable: UnitPosition[]
): RosterEntry[] =>
  members.map(({ user, role, position }) => ({
    id: user.id,
    name: user.name,
    email: loginEmailOf(user),
    role: position.name,
    promotionOptions: promotionTargets(assignable, position.level).map(
      ({ id, name }) => ({ id, label: name })
    ),
    roleLocked: user.id === currentUserId ? OWN_ROLE_LOCKED : undefined,
    lastLoginAt: user.lastLoginAt ?? null,
    removable: role !== 'UNIT_OWNER',
    emailEditable: role !== 'UNIT_OWNER',
    href: user.id,
  }))

export const courierRosterEntries = (members: CourierMember[]): RosterEntry[] =>
  members.map(({ courier, isActive }) => ({
    id: courier.id,
    name: courier.name,
    email: loginEmailOf(courier),
    role: isActive ? 'Ativo' : 'Parado',
    lastLoginAt: courier.lastLoginAt ?? null,
    quiet: true,
    removable: true,
  }))
