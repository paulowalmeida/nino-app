import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './Card'

describe(Card.displayName!, () => {
  it('renders children', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('applies the default variant (border + shadow-sm)', () => {
    render(<Card>x</Card>)
    expect(screen.getByText('x')).toHaveClass('shadow-sm')
  })

  it('flat variant does not apply shadow', () => {
    render(<Card variant="flat">x</Card>)
    const card = screen.getByText('x')
    expect(card).not.toHaveClass('shadow-sm')
    expect(card).not.toHaveClass('shadow-md')
  })

  it('elevated variant applies shadow-md', () => {
    render(<Card variant="elevated">x</Card>)
    expect(screen.getByText('x')).toHaveClass('shadow-md')
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
})
