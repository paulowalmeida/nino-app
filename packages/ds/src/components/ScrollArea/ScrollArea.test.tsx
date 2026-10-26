import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScrollArea } from './ScrollArea'

describe(ScrollArea.name, () => {
  it('renders its children', () => {
    render(
      <ScrollArea className="h-20">
        <p>scrollable content</p>
      </ScrollArea>
    )
    expect(screen.getByText('scrollable content')).toBeInTheDocument()
  })

  it('paints the thumb with the brand colour by default', () => {
    const { container } = render(
      <ScrollArea className="h-20">
        <p>x</p>
      </ScrollArea>
    )
    const root = container.querySelector('[data-part="root"]')
    expect(root).toHaveStyle({ '--ds-scroll-thumb': 'var(--color-brand)' })
  })

  it('takes a hex for stores with their own palette', () => {
    const { container } = render(
      <ScrollArea className="h-20" thumbColor="#0f766e">
        <p>x</p>
      </ScrollArea>
    )
    const root = container.querySelector('[data-part="root"]')
    expect(root).toHaveStyle({ '--ds-scroll-thumb': '#0f766e' })
  })

  it('keeps sizing styles alongside the thumb colour', () => {
    const { container } = render(
      <ScrollArea style={{ maxHeight: '10rem' }} thumbColor="#0f766e">
        <p>x</p>
      </ScrollArea>
    )
    const root = container.querySelector('[data-part="root"]')
    expect(root).toHaveStyle({ maxHeight: '10rem' })
  })

  it('applies root className', () => {
    const { container } = render(
      <ScrollArea className="h-20">
        <p>x</p>
      </ScrollArea>
    )
    expect(container.querySelector('[data-part="root"]')).toHaveClass('h-20')
  })
})
