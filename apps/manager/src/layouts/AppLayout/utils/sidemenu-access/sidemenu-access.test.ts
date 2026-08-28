import { describe, expect, it } from 'vitest'

import { groupsForRole } from './sidemenu-access'
import { sidemenuAccessGroupsMock } from './sidemenu-access.mock'

describe('groupsForRole', () => {
  it('keeps every item for the role that owns them', () => {
    const groups = groupsForRole(sidemenuAccessGroupsMock, 'TENANT_OWNER')

    expect(groups).toHaveLength(2)
    expect(groups[0].items).toHaveLength(2)
  })

  it('drops a group whose items are all out of reach for the role', () => {
    const groups = groupsForRole(sidemenuAccessGroupsMock, 'STAFF')

    expect(groups.map(({ title }) => title)).toEqual(['Dia a dia'])
    expect(groups[0].items.map(({ section }) => section)).toEqual(['cozinha'])
  })
})
