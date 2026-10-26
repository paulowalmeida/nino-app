import { describe, expect, it } from 'vitest'

import { toStoreSlug } from './store-slug.adapter'
import { storeSlugInputMock } from './store-slug.adapter.mock'

describe(toStoreSlug.name, () => {
  it('normalizes accents, separators and casing for a public URL', () => {
    expect(toStoreSlug(storeSlugInputMock)).toBe('lanchonete-do-ze-centro')
  })

  it('limits the slug to sixty characters', () => {
    expect(toStoreSlug('a'.repeat(80))).toHaveLength(60)
  })
})
