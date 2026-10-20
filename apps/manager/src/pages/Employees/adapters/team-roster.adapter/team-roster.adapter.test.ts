import { describe, expect, it } from 'vitest'

import { courierRosterEntries, staffRosterEntries } from './team-roster.adapter'
import {
  teamRosterAdapterMock,
  teamRosterAssignableMock,
  teamRosterStaffMembersMock,
} from './team-roster.adapter.mock'

describe('team roster adapter', () => {
  it('labels each member with their cargo and locks the current user', () => {
    const entries = staffRosterEntries(
      teamRosterStaffMembersMock,
      teamRosterAdapterMock.currentUserId,
      teamRosterAssignableMock
    )

    expect(entries[0]).toMatchObject({
      name: teamRosterAdapterMock.staffName,
      role: 'Dono',
      roleLocked: 'Você não pode mudar o próprio cargo',
      removable: false,
      promotionOptions: [],
    })
  })

  it('offers only higher cargos as promotion options', () => {
    const entries = staffRosterEntries(
      teamRosterStaffMembersMock,
      teamRosterAdapterMock.currentUserId,
      teamRosterAssignableMock
    )

    expect(entries[1]).toMatchObject({
      role: 'Atendente',
      removable: true,
      promotionOptions: [{ id: 'position-manager', label: 'Gerente' }],
    })
    expect(entries[1].roleLocked).toBeUndefined()
  })

  it('converts courier activity into a quiet roster entry', () => {
    const entries = courierRosterEntries([
      {
        courier: {
          id: 'courier-1',
          name: teamRosterAdapterMock.courierName,
          credentials: [],
          lastLoginAt: null,
        },
        isActive: false,
      },
    ] as never)

    expect(entries[0]).toMatchObject({
      name: teamRosterAdapterMock.courierName,
      role: 'Parado',
      quiet: true,
    })
  })

  it('keeps the last login of an active courier', () => {
    const entries = courierRosterEntries([
      {
        courier: {
          id: 'courier-2',
          name: teamRosterAdapterMock.courierName,
          credentials: [],
          lastLoginAt: '2026-01-01T00:00:00.000Z',
        },
        isActive: true,
      },
    ] as never)

    expect(entries[0]).toMatchObject({
      role: 'Ativo',
      lastLoginAt: '2026-01-01T00:00:00.000Z',
    })
  })
})
