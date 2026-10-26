import { describe, expect, it } from 'vitest'

import { openingHoursService } from './opening-hours.service'

describe('openingHoursService', () => {
  it('exposes the public opening-hours lookup', () => {
    expect(openingHoursService.getPublic).toBeTypeOf('function')
  })
})
