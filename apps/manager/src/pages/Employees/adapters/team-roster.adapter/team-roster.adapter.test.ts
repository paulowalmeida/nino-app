import { describe, expect, it } from 'vitest'

import { courierRosterEntries, staffRosterEntries } from './team-roster.adapter'

describe('team roster adapter', () => {
  it('converts staff and marks the current user role as locked', () => {
    const entries = staffRosterEntries([
      {
        user: { id: 'user-1', name: 'Ana Souza', credentials: [], lastLoginAt: null },
        role: 'TENANT_OWNER',
      },
    ] as never, 'user-1')
    expect(entries[0]).toMatchObject({ name: 'Ana Souza', roleLocked: 'Você não pode mudar o próprio cargo' })
  })

  it('converts courier activity into a quiet roster entry', () => {
    const entries = courierRosterEntries([
      { courier: { id: 'courier-1', name: 'Beto Lima', credentials: [], lastLoginAt: null }, isActive: false },
    ] as never)
    expect(entries[0]).toMatchObject({ name: 'Beto Lima', role: 'Parado', quiet: true })
  })
})
