import { describe, expect, it } from 'vitest'

import { settingsService } from './settings.service'

describe('settingsService', () => {
  it('exposes the public settings lookup', () => {
    expect(settingsService.getPublic).toBeTypeOf('function')
  })
})
