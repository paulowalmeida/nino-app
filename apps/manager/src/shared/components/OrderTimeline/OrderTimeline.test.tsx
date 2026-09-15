import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTimeline } from './OrderTimeline'
import { orderTimelineEntryMock } from './OrderTimeline.mock'

describe(OrderTimeline.name, () => {
  it('renders the oldest status first with its time', () => {
    render(<OrderTimeline entries={[orderTimelineEntryMock]} />)

    expect(screen.getByText('na cozinha')).toBeInTheDocument()
    expect(screen.getByText('pela loja')).toBeInTheDocument()
    expect(screen.getByRole('time')).toHaveAttribute('datetime', orderTimelineEntryMock.createdAt)
  })
})
