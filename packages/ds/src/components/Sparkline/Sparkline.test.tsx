import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Sparkline } from './Sparkline'

describe(Sparkline.name, () => {
  it('names the chart for assistive tech', () => {
    render(<Sparkline values={[1, 2, 3]} label="Faturamento em 7 dias" />)
    expect(
      screen.getByRole('img', { name: 'Faturamento em 7 dias' })
    ).toBeInTheDocument()
  })

  it('draws one vertex per value', () => {
    const { container } = render(<Sparkline values={[1, 5, 2, 8]} label="x" />)
    const line = container.querySelector('polyline')!
    expect(line.getAttribute('points')!.trim().split(/\s+/)).toHaveLength(4)
  })

  /* Um ponto não tem tendência, e a divisão pelo intervalo seria por zero. */
  it('renders nothing below two values', () => {
    const { container } = render(<Sparkline values={[7]} label="x" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('centers a flat series instead of dividing by zero', () => {
    const { container } = render(
      <Sparkline values={[5, 5, 5]} label="x" height={40} />
    )
    const ys = container
      .querySelector('polyline')!
      .getAttribute('points')!
      .trim()
      .split(/\s+/)
      .map((pair) => Number(pair.split(',')[1]))

    expect(ys.every((y) => y === 20)).toBe(true)
  })

  it('keeps the stroke fixed while the drawing stretches', () => {
    const { container } = render(<Sparkline values={[1, 2]} label="x" />)
    expect(container.querySelector('polyline')).toHaveAttribute(
      'vector-effect',
      'non-scaling-stroke'
    )
  })

  it('hides the end dot when asked', () => {
    const { container } = render(
      <Sparkline values={[1, 2]} label="x" showLastPoint={false} />
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
