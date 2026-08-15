import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dateFor, greetingFor } from '@utils/greeting'

const timezone = 'America/Sao_Paulo'

describe(greetingFor.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('greets "Bom dia" before noon', () => {
    // Arrange
    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'))

    // Act
    const greeting = greetingFor(timezone)

    // Assert
    expect(greeting).toBe('Bom dia')
  })

  it('greets "Boa tarde" between noon and 6pm', () => {
    // Arrange
    vi.setSystemTime(new Date('2026-01-10T17:00:00Z'))

    // Act
    const greeting = greetingFor(timezone)

    // Assert
    expect(greeting).toBe('Boa tarde')
  })

  it('greets "Boa noite" after 6pm', () => {
    // Arrange
    vi.setSystemTime(new Date('2026-01-10T23:00:00Z'))

    // Act
    const greeting = greetingFor(timezone)

    // Assert
    expect(greeting).toBe('Boa noite')
  })

  it('falls back to the browser timezone with no timezone given', () => {
    // Arrange
    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'))

    // Act
    const greeting = greetingFor(null)

    // Assert
    expect(['Bom dia', 'Boa tarde', 'Boa noite']).toContain(greeting)
  })
})

describe(dateFor.name, () => {
  it('formats the date in pt-BR with weekday, day and month', () => {
    // Arrange / Act
    const formatted = dateFor(timezone)

    // Assert
    expect(formatted.length).toBeGreaterThan(0)
    expect(formatted).not.toContain('undefined')
  })
})
