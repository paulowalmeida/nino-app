import { describe, expect, it } from 'vitest'

import { groupsForMember } from './sidemenu-access'
import {
  sidemenuAccessGroupsMock,
  sidemenuCounterAccessMock,
  sidemenuOwnerAccessMock,
  sidemenuReportsViewerAccessMock,
} from './sidemenu-access.mock'

describe('groupsForMember', () => {
  it('keeps every item for the owner', () => {
    const groups = groupsForMember(
      sidemenuAccessGroupsMock,
      sidemenuOwnerAccessMock
    )

    expect(groups).toHaveLength(2)
    expect(groups[0].items).toHaveLength(2)
  })

  it('keeps permission items for a cargo that holds the permission, but not owner-only ones', () => {
    const groups = groupsForMember(
      sidemenuAccessGroupsMock,
      sidemenuReportsViewerAccessMock
    )

    expect(groups.map(({ title }) => title)).toEqual(['Dia a dia'])
    expect(groups[0].items.map(({ section }) => section)).toEqual([
      'cozinha',
      'visao-geral',
    ])
  })

  it('drops items and groups out of reach for the cargo', () => {
    const groups = groupsForMember(
      sidemenuAccessGroupsMock,
      sidemenuCounterAccessMock
    )

    expect(groups.map(({ title }) => title)).toEqual(['Dia a dia'])
    expect(groups[0].items.map(({ section }) => section)).toEqual(['cozinha'])
  })

  it('shows only unrestricted items while no unit is selected', () => {
    const groups = groupsForMember(sidemenuAccessGroupsMock, null)

    expect(groups[0].items.map(({ section }) => section)).toEqual(['cozinha'])
  })
})
