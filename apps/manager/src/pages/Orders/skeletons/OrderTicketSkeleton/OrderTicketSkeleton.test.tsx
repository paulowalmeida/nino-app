import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTicketSkeleton } from './OrderTicketSkeleton'
import { orderTicketSkeletonMock } from './OrderTicketSkeleton.mock'

describe(OrderTicketSkeleton.name, () => {
  it('renders the ticket loading shape with the visible item count', () => {
    const { container } = render(<OrderTicketSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      orderTicketSkeletonMock.itemCount + 12
    )
  })

  it('uses the same horizontal header, item rows, and footer as a ticket', () => {
    const { container } = render(<OrderTicketSkeleton />)

    expect(container.querySelector('header')).toHaveClass('flex-row')
    expect(container.querySelector('li')).not.toHaveClass('flex-col')
    expect(container.querySelector('footer')).not.toHaveClass('flex-col')
  })
})
