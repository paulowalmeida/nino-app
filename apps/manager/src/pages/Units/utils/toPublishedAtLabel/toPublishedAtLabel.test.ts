import { describe, expect, it } from 'vitest'

import { toPublishedAtLabel } from './toPublishedAtLabel'
import {
  invalidPublishedAtMock,
  publishedAtMock,
} from './toPublishedAtLabel.mock'

describe('toPublishedAtLabel', () => {
  it('formats the publication moment for the pt-BR reader', () => {
    const label = toPublishedAtLabel(publishedAtMock)

    expect(label).toContain('set')
    expect(label).toContain('2026')
  })

  it('explains a version that was never published', () => {
    expect(toPublishedAtLabel(null)).toBe('Sem data de publicação')
  })

  it('does not print an invalid date as text', () => {
    expect(toPublishedAtLabel(invalidPublishedAtMock)).toBe(
      'Sem data de publicação'
    )
  })
})
