import { describe, expect, it } from 'vitest'

import { storeService } from './store.service'

describe('storeService', () => {
  it('exposes the store lookup by slug', () => {
    expect(storeService.getBySlug).toBeTypeOf('function')
  })
})
