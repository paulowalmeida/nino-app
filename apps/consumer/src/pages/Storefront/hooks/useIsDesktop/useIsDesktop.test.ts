import { describe, expect, it } from 'vitest'
import { useIsDesktop } from './useIsDesktop'
describe('useIsDesktop', () => {
  it('exposes the viewport hook', () => {
    expect(useIsDesktop).toBeTypeOf('function')
  })
})
