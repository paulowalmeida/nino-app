import { expect, it } from 'vitest'
import { categoryIcon } from './category-icon'
it('finds an icon', () => expect(categoryIcon('Pizza')).toBe('🍕'))
