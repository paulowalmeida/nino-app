import { describe, expect, it } from 'vitest'

import { toUnitsWelcomeTitle } from './toUnitsWelcomeTitle'

describe(toUnitsWelcomeTitle.name, () => {
  it('uses the first name when a user name is available', () => {
    expect(toUnitsWelcomeTitle('Marina Silva')).toBe('Sua primeira loja, Marina')
  })

  it('uses the generic title without a user name', () => {
    expect(toUnitsWelcomeTitle()).toBe('Sua primeira loja')
  })
})
