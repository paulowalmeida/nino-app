import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Collapsible } from './Collapsible'

describe(Collapsible.name, () => {
  it('renders the trigger', () => {
    render(<Collapsible trigger="Toggle">content</Collapsible>)
    expect(screen.getByText('Toggle')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    const { container } = render(
      <Collapsible trigger="Toggle">content</Collapsible>
    )
    expect(container.querySelector('[data-part="trigger"]')).toHaveAttribute(
      'data-state',
      'closed'
    )
  })

  it('fires onOpenChange when toggled', async () => {
    const onOpenChange = vi.fn()
    render(
      <Collapsible trigger="Toggle" onOpenChange={onOpenChange}>
        content
      </Collapsible>
    )
    await userEvent.click(screen.getByText('Toggle'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('respects defaultOpen', () => {
    const { container } = render(
      <Collapsible trigger="Toggle" defaultOpen>
        content
      </Collapsible>
    )
    expect(container.querySelector('[data-part="trigger"]')).toHaveAttribute(
      'data-state',
      'open'
    )
  })
})
