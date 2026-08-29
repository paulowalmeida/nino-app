import { describe, expect, it } from 'vitest'
import { CategoryNav } from './CategoryNav'
import { categoryNavMock } from './CategoryNav.mock'

describe('CategoryNav', () => {
  it('exports the category navigation contract', () => {
    expect(CategoryNav).toBeDefined()
    expect(categoryNavMock.activeId).toBe('burgers')
  })
})
