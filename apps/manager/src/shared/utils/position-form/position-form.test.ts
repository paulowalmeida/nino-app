import { describe, expect, it } from 'vitest'

import {
  emptyPositionFormValues,
  formValuesToDraft,
  groupPermissions,
  lowestPositionId,
  matchesPermission,
  placementOptions,
  positionToFormValues,
  togglePermission,
} from './position-form'
import {
  positionFormCatalogMock,
  positionFormPositionMock,
  positionFormRankedMock,
  positionFormTopMock,
} from './position-form.mock'

describe('position form helpers', () => {
  it('starts a new cargo empty, placed under the given one', () => {
    expect(emptyPositionFormValues('position-staff')).toEqual({
      name: '',
      belowPositionId: 'position-staff',
      permissions: [],
    })
  })

  it('turns an existing cargo into form values', () => {
    expect(positionToFormValues(positionFormPositionMock)).toEqual({
      name: 'Caixa',
      belowPositionId: 'position-manager',
      permissions: ['cashbox.operate'],
    })
  })

  it('keeps the placement empty for the cargo at the top', () => {
    expect(positionToFormValues(positionFormTopMock).belowPositionId).toBe('')
  })

  it('trims the name when building the draft', () => {
    expect(
      formValuesToDraft({
        name: '  Caixa  ',
        belowPositionId: 'position-manager',
        permissions: ['cashbox.operate'],
      })
    ).toEqual({
      name: 'Caixa',
      belowPositionId: 'position-manager',
      permissions: ['cashbox.operate'],
    })
  })

  it('offers every cargo but the one being edited as a placement', () => {
    expect(placementOptions(positionFormRankedMock, 'position-1')).toEqual([
      { value: 'position-owner', label: 'Dono' },
      { value: 'position-manager', label: 'Gerente' },
    ])
    expect(placementOptions(positionFormRankedMock, undefined)).toHaveLength(3)
  })

  it('puts a new cargo under the lowest one, or nowhere on an empty list', () => {
    expect(lowestPositionId(positionFormRankedMock)).toBe('position-1')
    expect(lowestPositionId([])).toBe('')
  })

  it('groups the catalog keeping the order groups first appear', () => {
    const groups = groupPermissions(positionFormCatalogMock)

    expect(groups.map(({ group, label }) => [group, label])).toEqual([
      ['operation', 'Operação'],
      ['business', 'Negócio'],
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

describe('matchesPermission', () => {
  const [cashbox] = positionFormCatalogMock

  it('matches label or description ignoring case and accents', () => {
    expect(matchesPermission(cashbox, 'CAIXA')).toBe(true)
    expect(matchesPermission(cashbox, 'movimentar')).toBe(true)
    expect(matchesPermission(cashbox, 'relatorios')).toBe(false)
  })

  it('matches everything for an empty term', () => {
    expect(matchesPermission(cashbox, '  ')).toBe(true)
  })
})
