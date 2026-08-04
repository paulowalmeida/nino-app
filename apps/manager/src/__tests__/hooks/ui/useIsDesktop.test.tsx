import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useIsDesktop } from '@hooks/ui/useIsDesktop'

type Listener = () => void

const stubMatchMedia = (matches: boolean) => {
  let listener: Listener | null = null
  const mql = {
    matches,
    addEventListener: (_event: string, callback: Listener) => {
      listener = callback
    },
    removeEventListener: () => {
      listener = null
    },
  }

  vi.stubGlobal('matchMedia', () => mql)

  return {
    fireChange: (nextMatches: boolean) => {
      mql.matches = nextMatches
      listener?.()
    },
  }
}

describe(useIsDesktop.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts as desktop when the query already matches', () => {
    // Arrange / Act
    stubMatchMedia(true)
    const { result } = renderHook(() => useIsDesktop())

    // Assert
    expect(result.current).toBe(true)
  })

  it('starts as mobile when the query does not match', () => {
    // Arrange / Act
    stubMatchMedia(false)
    const { result } = renderHook(() => useIsDesktop())

    // Assert
    expect(result.current).toBe(false)
  })

  it('updates when the media query changes', () => {
    // Arrange
    const { fireChange } = stubMatchMedia(false)
    const { result } = renderHook(() => useIsDesktop())

    // Act
    act(() => fireChange(true))

    // Assert
    expect(result.current).toBe(true)
  })
})
