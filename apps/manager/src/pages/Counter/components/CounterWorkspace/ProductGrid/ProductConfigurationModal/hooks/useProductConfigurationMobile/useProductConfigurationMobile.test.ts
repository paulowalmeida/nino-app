import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProductConfigurationMobile } from './useProductConfigurationMobile'
import { mobileMediaQueryMock } from './useProductConfigurationMobile.mock'

describe(useProductConfigurationMobile.name, () => {
  it('reads the 425px mobile breakpoint', () => {
    const mediaQuery = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery))

    const { result } = renderHook(() => useProductConfigurationMobile())

    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith(mobileMediaQueryMock.query)
  })
})
