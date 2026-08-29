import { expect, it } from 'vitest'
import { riseDelay } from './rise-delay'
it('sets animation delay', () =>
  expect((riseDelay(100) as Record<string, string>)['--d']).toBe('100ms'))
