import { describe, expect, it } from 'vitest'

import {
  foldSearch,
  highlightMatch,
  matchesQuery,
} from './menu-search'
import { menuSearchMock } from './menu-search.mock'

describe('menu-search', () => {
  it('folds accent and case', () => {
    expect(foldSearch('Pão')).toBe('pao')
  })

  it('matches ignoring accent and case', () => {
    expect(matchesQuery(menuSearchMock.text, 'PAO')).toBe(true)
    expect(matchesQuery(menuSearchMock.text, 'pizza')).toBe(false)
    expect(matchesQuery(null, 'pao')).toBe(false)
  })

  it('highlights the original text that matched', () => {
    expect(highlightMatch(menuSearchMock.text, menuSearchMock.query)).toEqual([
      { text: menuSearchMock.matched, isMatch: true },
      { text: ' de Queijo', isMatch: false },
    ])
  })

  it('returns the whole text when nothing matches', () => {
    expect(highlightMatch('Suco', 'pizza')).toEqual([
      { text: 'Suco', isMatch: false },
    ])
  })
})
