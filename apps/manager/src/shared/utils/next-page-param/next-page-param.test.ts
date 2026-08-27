import { describe, expect, it } from 'vitest'

import { nextPageParam } from './next-page-param'

describe('nextPageParam', () => {
  it('requests the next page while there is more data to load', () => {
    expect(nextPageParam({ page: 1, total: 25 }, 10)).toBe(2)
  })

  it('stops paginating once every item has loaded', () => {
    expect(nextPageParam({ page: 3, total: 25 }, 10)).toBeUndefined()
  })
})
