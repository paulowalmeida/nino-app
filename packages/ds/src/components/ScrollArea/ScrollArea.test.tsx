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

  it('applies root className', () => {
    const { container } = render(
      <ScrollArea className="h-20">
        <p>x</p>
      </ScrollArea>
    )
    expect(container.querySelector('[data-part="root"]')).toHaveClass('h-20')
  })
})
