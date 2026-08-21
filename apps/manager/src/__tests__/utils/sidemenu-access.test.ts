import { describe, expect, it } from 'vitest'

import { groupsForRole, openSectionAt } from '@utils/sidemenu-access'

import { menuGroups } from './sidemenu-access.mock'

describe('groupsForRole', () => {
  it('keeps the items that ask for no role', () => {
    // Arrange
    const role = null

    // Act
    const groups = groupsForRole(menuGroups, role)

    // Assert
    expect(groups[0].items.map(({ section }) => section)).toEqual(['pedidos'])
  })

  it('adds the items the role is allowed to see', () => {
    // Arrange
    const role = 'TENANT_OWNER' as const

    // Act
    const groups = groupsForRole(menuGroups, role)

    // Assert
    expect(groups[1].items.map(({ section }) => section)).toEqual([
      'relatorios',
      'configuracoes',
    ])
  })

  it('hides the restricted items from a role without access', () => {
    // Arrange
    const role = 'STAFF' as const

    // Act
    const groups = groupsForRole(menuGroups, role)

    // Assert
    expect(groups[1].items).toEqual([])
  })

  it('keeps every group so the section titles survive the filter', () => {
    // Arrange
    const role = 'STAFF' as const

    // Act
    const groups = groupsForRole(menuGroups, role)

    // Assert
    expect(groups.map(({ title }) => title)).toEqual(['Do dia', 'Da loja'])
  })
})

describe('openSectionAt', () => {
  it('opens the group the current path is inside', () => {
    // Arrange
    const pathname = '/tenant-1/configuracoes/empresa'

    // Act
    const section = openSectionAt(menuGroups, pathname)

    // Assert
    expect(section).toBe('configuracoes')
  })

  it('opens nothing when the path is on a plain item', () => {
    // Arrange
    const pathname = '/tenant-1/pedidos'

    // Act
    const section = openSectionAt(menuGroups, pathname)

    // Assert
    expect(section).toBeNull()
  })

  it('ignores an item that has no children', () => {
    // Arrange
    const pathname = '/tenant-1/relatorios'

    // Act
    const section = openSectionAt(menuGroups, pathname)

    // Assert
    expect(section).toBeNull()
  })
})
