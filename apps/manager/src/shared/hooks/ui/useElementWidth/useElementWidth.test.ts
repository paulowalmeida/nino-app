import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useElementWidth } from './useElementWidth'

describe(useElementWidth.name, () => {
  it('starts without a measured element', () => {
    const { result } = renderHook(() => useElementWidth<HTMLDivElement>())

    expect(result.current.ref.current).toBeNull()
    expect(result.current.width).toBe(0)
  })
})
