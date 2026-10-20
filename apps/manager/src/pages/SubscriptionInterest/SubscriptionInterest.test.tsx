import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSubscriptionInterestFacade } from './facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'
import { SubscriptionInterest } from './SubscriptionInterest'
import { subscriptionInterestPageCopyMock } from './SubscriptionInterest.mock'

vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('./facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade')

describe(SubscriptionInterest.name, () => {
  it('composes the header and the request form', () => {
    // Arrange
    vi.mocked(useSubscriptionInterestFacade).mockReturnValue({
      requestInterest: vi.fn(),
      isRequestingInterest: false,
      isRequestInterestError: false,
    })

    // Act
    render(<SubscriptionInterest />)

    // Assert
    expect(
      screen.getByRole('heading', {
        name: subscriptionInterestPageCopyMock.title,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: subscriptionInterestPageCopyMock.submitLabel,
      })
    ).toBeInTheDocument()
  })
})
