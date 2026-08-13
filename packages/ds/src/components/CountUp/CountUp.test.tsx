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

  /* Com a animação ligada o número corre quadro a quadro, então o teste
   * precisa segurar o relógio e o agendador para ver cada passo. */
  const withMotion = () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    let now = 0
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('performance', { now: () => now })
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frames.push(cb)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    return {
      advance: (ms: number) => {
        now += ms
        const pending = frames.splice(0, frames.length)
        act(() => pending.forEach((cb) => cb(now)))
      },
    }
  }

  it('runs the number up to the new value', () => {
    // Arrange
    const clock = withMotion()
    const { rerender } = render(<CountUp value={0} />)

    // Act
    act(() => {
      rerender(<CountUp value={100} />)
    })
    clock.advance(460)

    // Assert
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('carries on from where it was when the value changes mid-run', () => {
    // Arrange
    const clock = withMotion()
    const { rerender } = render(<CountUp value={0} />)
    act(() => {
      rerender(<CountUp value={100} />)
    })
    clock.advance(230)
    const midway = Number(screen.getByText(/\d/).textContent)

    // Act — o valor muda antes de a primeira corrida terminar
    act(() => {
      rerender(<CountUp value={200} />)
    })
    clock.advance(16)

    // Assert — segue de onde estava, sem voltar para o início
    const afterChange = Number(screen.getByText(/\d/).textContent)
    expect(midway).toBeGreaterThan(0)
    expect(afterChange).toBeGreaterThanOrEqual(midway)
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
