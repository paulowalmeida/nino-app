import type { RosterEntry } from '@shared/types/team/roster-entry'

export const employeesContentFacadeMock = {
  unit: { role: 'UNIT_OWNER' },
  inviteSeats: [],
  staffEntries: [
    {
      id: 'user-2',
      name: 'Caio Dias',
      email: 'caio@example.com',
      role: 'Atendente',
      lastLoginAt: null,
      removable: true,
    },
  ] as RosterEntry[],
  courierEntries: [] as RosterEntry[],
  isStaffPending: false,
  isCourierPending: false,
  isRemoving: false,
  removingVariables: undefined,
  isChangingPosition: false,
  positionVariables: undefined,
}
