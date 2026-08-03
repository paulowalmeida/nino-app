import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CountUp } from './CountUp'

describe(CountUp.name, () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the given value on first render', () => {
    // Arrange / Act
    render(<CountUp value={42} />)

    // Assert
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows zero without crashing', () => {
    // Arrange / Act
    render(<CountUp value={0} />)

    // Assert
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows a negative value without crashing', () => {
    // Arrange / Act
    render(<CountUp value={-5} />)

    // Assert
    expect(screen.getByText('-5')).toBeInTheDocument()
  })

  it('jumps straight to the new value when motion is reduced', () => {
    // Arrange
    const { rerender } = render(<CountUp value={10} />)

    // Act
    act(() => {
      rerender(<CountUp value={25} />)
    })

    // Assert
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
