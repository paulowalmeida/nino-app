import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useElapsed } from './useElapsed'
import { elapsedHookMock } from './useElapsed.mock'

describe(useElapsed.name, () => {
  it('returns the elapsed state for the kitchen clock', () => {
    const { result } = renderHook(() => useElapsed(elapsedHookMock.startedAt, elapsedHookMock.dueMinutes))
    expect(result.current).toEqual(expect.objectContaining({ ratio: expect.any(Number) }))
  })
})
