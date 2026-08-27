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
})
