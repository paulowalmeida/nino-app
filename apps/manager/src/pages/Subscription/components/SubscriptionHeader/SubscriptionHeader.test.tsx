import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionHeader } from './SubscriptionHeader'
import { subscriptionHeaderCopyMock } from './SubscriptionHeader.mock'

describe(SubscriptionHeader.name, () => {
  it('introduces the company subscription', () => {
    // Arrange
    render(<SubscriptionHeader />)

    // Assert
    expect(
      screen.getByRole('heading', { name: subscriptionHeaderCopyMock.title })
    ).toBeInTheDocument()
    expect(
      screen.getByText(subscriptionHeaderCopyMock.description)
    ).toBeInTheDocument()
  })
})
