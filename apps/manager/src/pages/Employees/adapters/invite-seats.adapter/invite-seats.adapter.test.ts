import { describe, expect, it } from 'vitest'

import { COURIER_SEAT, inviteSeatsOf } from './invite-seats.adapter'
import { inviteSeatsAssignableMock } from './invite-seats.adapter.mock'

describe('inviteSeatsOf', () => {
  it('offers the cargos from lowest to highest followed by the courier', () => {
    expect(inviteSeatsOf(inviteSeatsAssignableMock)).toEqual([
      { value: 'position-staff', label: 'Atendente' },
      { value: 'position-manager', label: 'Gerente' },
      { value: COURIER_SEAT, label: 'Entregador' },
    ])
  })

  it('still offers the courier when no cargo can be granted', () => {
    expect(inviteSeatsOf([])).toEqual([
      { value: COURIER_SEAT, label: 'Entregador' },
    ])
  })
})
