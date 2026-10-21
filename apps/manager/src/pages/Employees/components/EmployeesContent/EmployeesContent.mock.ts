import type { RosterEntry } from '@shared/types/team/roster-entry'

export const employeesContentFacadeMock = {
  unit: { role: 'UNIT_OWNER' },
  inviteSeats: [],
  activeEntries: [
    {
      id: 'user-2',
      kind: 'STAFF',
      name: 'Caio Dias',
      email: 'caio@example.com',
      role: 'Atendente',
      lastLoginAt: null,
      removable: true,
    },
  ] as RosterEntry[],
  inactiveEntries: [] as RosterEntry[],
  isActivePending: false,
  isInactivePending: false,
  isRemoving: false,
  removingVariables: undefined,
  isChangingPosition: false,
  positionVariables: undefined,
  isChangingActivity: false,
  activityVariables: undefined,
}
