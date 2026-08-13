import { describe, expect, it } from 'vitest'

import { demoOrder, demoTimeline } from '@utils/welcome-demo-order'

describe('demoOrder', () => {
  it('builds a demo order with the requested status', () => {
    // Arrange / Act
    const order = demoOrder('PENDING')

    // Assert
    expect(order.status).toBe('PENDING')
    expect(order.items).toHaveLength(2)
  })

  it('backdates createdAt by the given elapsed minutes', () => {
    // Arrange
    const before = Date.now()

    // Act
    const order = demoOrder('PREPARING', 10)

    // Assert
    const elapsedMs = before - new Date(order.createdAt).getTime()
    expect(elapsedMs).toBeGreaterThanOrEqual(10 * 60_000 - 1_000)
  })

  it('defaults to zero elapsed minutes with none given', () => {
    // Arrange
    const before = Date.now()

    // Act
    const order = demoOrder('PENDING')

    // Assert
    expect(new Date(order.createdAt).getTime()).toBeGreaterThanOrEqual(before)
  })
})

describe('demoTimeline', () => {
  it('marks only the first entry as guest-initiated', () => {
    // Arrange / Act
    const entries = demoTimeline()

    // Assert
    expect(entries[0].changedByRealm).toBe('GUEST')
    expect(entries.slice(1).every((e) => e.changedByRealm === 'OPERATIONAL'))
      .toBe(true)
  })

  it('keeps entries in chronological order', () => {
    // Arrange / Act
    const entries = demoTimeline()

    // Assert
    const times = entries.map((entry) => new Date(entry.createdAt).getTime())
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })
})
