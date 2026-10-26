import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { recentlyFinished } from './recently-finished'
import {
  justLeftKitchenMock,
  leftKitchenHoursAgoMock,
  withoutHistoryMock,
} from './recently-finished.mock'

const NOW = new Date('2026-08-01T12:00:00.000Z')

describe('recentlyFinished', () => {
  beforeEach(() => vi.setSystemTime(NOW))
  afterEach(() => vi.useRealTimers())

  it('keeps what left the kitchen inside the window', () => {
    const result = recentlyFinished([justLeftKitchenMock], 90)
    expect(result).toEqual([justLeftKitchenMock])
  })

  it('drops what left before the window opened', () => {
    const result = recentlyFinished([leftKitchenHoursAgoMock], 90)
    expect(result).toEqual([])
  })

  it('reads the moment of the transition, not the order creation', () => {
    // Arrange: criado às 9h, saiu às 11h50 — a criação sozinha o excluiria
    const result = recentlyFinished([justLeftKitchenMock], 90)

    // Assert
    expect(result).toHaveLength(1)
  })

  it('falls back to the creation when there is no history', () => {
    const result = recentlyFinished([withoutHistoryMock], 90)
    expect(result).toEqual([])
  })

  it('returns an empty wall when nothing finished', () => {
    expect(recentlyFinished([], 90)).toEqual([])
  })
})
