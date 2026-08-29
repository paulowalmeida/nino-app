import { expect, it } from 'vitest'
import { storeInitials } from './store-info'
it('builds initials', () =>
  expect(
    storeInitials({
      customName: 'Loja Nino',
      company: { name: 'Nino' },
    } as never)
  ).toBe('LN'))
