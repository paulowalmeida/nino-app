import { afterEach, describe, expect, it, vi } from 'vitest'

import { lastOrderLabel } from './order-recency'

const NOW = new Date('2026-08-16T15:00:00.000Z')

const daysBefore = (days: number): string =>
  new Date(NOW.getTime() - days * 86_400_000).toISOString()

afterEach(() => {
  vi.useRealTimers()
})

describe(lastOrderLabel.name, () => {
  it('reads today when the order landed earlier in the same day', () => {
    // Arrange
    vi.useFakeTimers().setSystemTime(NOW)

    // Act
    const label = lastOrderLabel(NOW.toISOString())

    // Assert
    expect(label).toBe('pediu hoje')
  })

  it('reads yesterday when a single day has turned', () => {
    // Arrange
    vi.useFakeTimers().setSystemTime(NOW)

    // Act
    const label = lastOrderLabel(daysBefore(1))

    // Assert
    expect(label).toBe('pediu ontem')
  })

  it('counts the days once the order is older than yesterday', () => {
    // Arrange
    vi.useFakeTimers().setSystemTime(NOW)

    // Act
    const label = lastOrderLabel(daysBefore(46))

    // Assert
    expect(label).toBe('último pedido há 46 dias')
  })

  it('says there is no order yet when the date is missing', () => {
    // Arrange / Act
    const label = lastOrderLabel(null)

    // Assert
    expect(label).toBe('ainda sem pedido aqui')
  })

  it('says there is no order yet when the date cannot be read', () => {
    // Arrange / Act
    const label = lastOrderLabel('not-a-date')

    // Assert
    expect(label).toBe('ainda sem pedido aqui')
  })
})
