import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TallyCard } from './TallyCard'
import { tallyCardMock } from './TallyCard.mock'

describe('TallyCard', () => {
  it('renders the metric link', () => {
    render(<TallyCard {...tallyCardMock} isPending={false} value="12" skeletonClassName="skeleton" />, {
      wrapper: MemoryRouter,
    })

    expect(screen.getByRole('link', { name: tallyCardMock.ariaLabel })).toBeInTheDocument()
    expect(screen.getByText(tallyCardMock.label)).toBeInTheDocument()
  })

  it('renders a placeholder while pending', () => {
    render(<TallyCard {...tallyCardMock} isPending value="12" skeletonClassName="skeleton" />, {
      wrapper: MemoryRouter,
    })

    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
