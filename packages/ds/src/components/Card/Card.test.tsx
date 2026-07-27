import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './Card'

describe(Card.displayName!, () => {
  it('renders children', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('applies the default variant (border + resting shadow)', () => {
    render(<Card>x</Card>)
    expect(screen.getByText('x')).toHaveClass('shadow-card')
  })

  it('flat variant does not apply shadow', () => {
    render(<Card variant="flat">x</Card>)
    const card = screen.getByText('x')
    expect(card).not.toHaveClass('shadow-card')
    expect(card).not.toHaveClass('shadow-card-hover')
  })

  it('elevated variant applies the lifted shadow', () => {
    render(<Card variant="elevated">x</Card>)
    expect(screen.getByText('x')).toHaveClass('shadow-card-hover')
  })

  it('merges additional className', () => {
    render(<Card className="w-64">x</Card>)
    expect(screen.getByText('x')).toHaveClass('w-64')
  })

  it('forwards ref to the root element', () => {
    const ref = { current: null }
    render(<Card ref={ref}>x</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders a div by default', () => {
    render(<Card>x</Card>)
    expect(screen.getByText('x').tagName).toBe('DIV')
  })

  it('delegates rendering to the child when asChild is set', () => {
    render(
      <Card asChild>
        <a href="/pedidos">Ver pedidos</a>
      </Card>
    )
    const link = screen.getByRole('link', { name: 'Ver pedidos' })
    expect(link).toHaveClass('rounded-card')
    expect(link).toHaveClass('shadow-card')
  })

  it('keeps the child as the only element when asChild is set', () => {
    const { container } = render(
      <Card asChild>
        <button type="button">Escolher loja</button>
      </Card>
    )
    expect(container.querySelector('div')).not.toBeInTheDocument()
  })
})
