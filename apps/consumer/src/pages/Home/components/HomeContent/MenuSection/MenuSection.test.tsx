import { describe, expect, it } from 'vitest'
import { MenuSection } from './MenuSection'
import { menuSectionMock } from './MenuSection.mock'

describe('MenuSection', () => {
  it('exports the menu section contract', () => {
    expect(MenuSection).toBeDefined()
    expect(menuSectionMock.storeOpen).toBe(true)
  })
})
