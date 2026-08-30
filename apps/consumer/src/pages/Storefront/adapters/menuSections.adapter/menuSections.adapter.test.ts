import { describe, expect, it } from 'vitest'
import { menuSections } from './menuSections.adapter'
import { menuSectionsAdapterMock } from './menuSections.adapter.mock'

describe('menuSections', () => {
  it('keeps active items and groups them by category', () => {
    const result = menuSections([
      menuSectionsAdapterMock.activeItem,
      menuSectionsAdapterMock.inactiveItem,
    ] as never)
    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(1)
  })
})
