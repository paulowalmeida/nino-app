import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useBackTarget } from './useBackTarget'
import {
  backFallbackMock,
  backOriginMock,
  brokenOriginMock,
} from './useBackTarget.mock'

const wrapperWith = (state: unknown) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[{ pathname: '/pedido', state }]}>
      {children}
    </MemoryRouter>
  )
  return Wrapper
}

describe(useBackTarget.name, () => {
  it('returns the place the person came from', () => {
    const { result } = renderHook(() => useBackTarget(backFallbackMock), {
      wrapper: wrapperWith({ from: backOriginMock }),
    })

    expect(result.current).toEqual(backOriginMock)
  })

  it('falls back when the history says nothing', () => {
    const { result } = renderHook(() => useBackTarget(backFallbackMock), {
      wrapper: wrapperWith(null),
    })

    expect(result.current).toEqual(backFallbackMock)
  })

  it('falls back when the history carries something else', () => {
    const { result } = renderHook(() => useBackTarget(backFallbackMock), {
      wrapper: wrapperWith({ from: brokenOriginMock }),
    })

    expect(result.current).toEqual(backFallbackMock)
  })
})
