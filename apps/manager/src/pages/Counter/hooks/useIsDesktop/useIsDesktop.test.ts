import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useIsDesktop } from './useIsDesktop'
import { desktopMediaQueryMock } from './useIsDesktop.mock'

describe('useIsDesktop', () => {
  it('reflects the current desktop media query', () => {
    const mediaQuery = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery))

    const { result } = renderHook(() => useIsDesktop())

    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith(desktopMediaQueryMock)
  })
})
