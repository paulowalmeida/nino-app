import { expect, it } from 'vitest'
import { toE164 } from './phone'
it('normalizes a phone', () =>
  expect(toE164('(91) 99999-9999')).toBe('+5591999999999'))
