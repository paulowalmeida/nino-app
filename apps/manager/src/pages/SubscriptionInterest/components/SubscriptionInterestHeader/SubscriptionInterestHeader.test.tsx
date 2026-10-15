import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionInterestHeader } from './SubscriptionInterestHeader'
import { subscriptionInterestHeaderCopyMock } from './SubscriptionInterestHeader.mock'

describe(SubscriptionInterestHeader.name, () => {
  it('introduces the Rede plan request', () => {
    // Arrange
    render(<SubscriptionInterestHeader />)

    // Assert
    expect(
      screen.getByRole('heading', {
        name: subscriptionInterestHeaderCopyMock.title,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(subscriptionInterestHeaderCopyMock.description)
    ).toBeInTheDocument()
  })
})
