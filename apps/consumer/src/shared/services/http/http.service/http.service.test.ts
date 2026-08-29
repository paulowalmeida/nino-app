import { describe, expect, it } from 'vitest'

import { api } from './http.service'

describe('http service', () => {
  it('exposes the shared API transport', () => {
    expect(api).toBeDefined()
  })
})
