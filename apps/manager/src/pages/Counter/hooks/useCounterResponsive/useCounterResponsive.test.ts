import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterResponsive } from './useCounterResponsive'

const setSheet = vi.fn()

vi.mock('@pages/Counter/hooks/useIsDesktop/useIsDesktop', () => ({
  useIsDesktop: vi.fn((onChange?: (value: boolean) => void) => {
    onChange?.(true)
    onChange?.(false)
    return true
  }),
}))
vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (
    selector: (value: { setSheet: typeof setSheet }) => unknown
  ) => selector({ setSheet }),
}))

describe(useCounterResponsive.name, () => {
  it('exposes the desktop state', () => {
    const { result } = renderHook(() => useCounterResponsive())
    expect(result.current.isDesktop).toBe(true)
    expect(setSheet).toHaveBeenCalledWith(false)
  })
})
