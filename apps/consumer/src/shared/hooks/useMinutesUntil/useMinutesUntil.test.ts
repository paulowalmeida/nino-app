import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useMinutesUntil } from './useMinutesUntil'
import { useMinutesUntilMock } from './useMinutesUntil.mock'

afterEach(() => vi.useRealTimers())

describe('useMinutesUntil', () => {
  it('returns null without a delivery estimate or with an invalid timestamp', () => {
    expect(renderHook(() => useMinutesUntil(null)).result.current).toBeNull()
    expect(
      renderHook(() => useMinutesUntil(useMinutesUntilMock.invalidIso)).result
        .current
    ).toBeNull()
  })

  it('rounds a future estimate up to complete minutes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-29T19:40:30.000Z'))

    expect(
      renderHook(() => useMinutesUntil(useMinutesUntilMock.futureIso)).result
        .current
    ).toBe(20)
  })
})
