import { describe, expect, it } from 'vitest'

import {
  emptyPositionFormValues,
  formValuesToDraft,
  groupPermissions,
  positionToFormValues,
  togglePermission,
} from './position-form'
import {
  positionFormCatalogMock,
  positionFormPositionMock,
} from './position-form.mock'

describe('position form helpers', () => {
  it('starts a new cargo empty at the given level', () => {
    expect(emptyPositionFormValues(20)).toEqual({
      name: '',
      level: 20,
      permissions: [],
    })
  })

  it('turns an existing cargo into form values', () => {
    expect(positionToFormValues(positionFormPositionMock)).toEqual({
      name: 'Caixa',
      level: 30,
      permissions: ['cashbox.operate'],
    })
  })

  it('trims the name when building the draft', () => {
    expect(
      formValuesToDraft({
        name: '  Caixa  ',
        level: 30,
        permissions: ['cashbox.operate'],
      })
    ).toEqual({ name: 'Caixa', level: 30, permissions: ['cashbox.operate'] })
  })

  it('groups the catalog keeping the order groups first appear', () => {
    const groups = groupPermissions(positionFormCatalogMock)

    expect(groups.map(({ group, label }) => [group, label])).toEqual([
      ['operation', 'Operação do dia'],
      ['sales', 'Vendas e clientes'],
    ])
    expect(groups[0].permissions.map(({ key }) => key)).toEqual([
      'cashbox.operate',
      'orders.operate',
    ])
  })

  it('adds a checked permission once and removes an unchecked one', () => {
    expect(togglePermission(['reports.view'], 'cashbox.operate', true)).toEqual(
      ['reports.view', 'cashbox.operate']
    )
    expect(
      togglePermission(['cashbox.operate'], 'cashbox.operate', true)
    ).toEqual(['cashbox.operate'])
    expect(
      togglePermission(
        ['reports.view', 'cashbox.operate'],
        'reports.view',
        false
      )
    ).toEqual(['cashbox.operate'])
  })
})
