import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionInterestSent } from './SubscriptionInterestSent'
import { subscriptionRouteMock } from './SubscriptionInterestSent.mock'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({ useNavigate: () => navigate }))

describe(SubscriptionInterestSent.name, () => {
  it('confirms the request was received', () => {
    // Arrange
    render(<SubscriptionInterestSent />)

    // Assert
    expect(screen.getByText('Solicitação enviada')).toBeInTheDocument()
  })

  it('returns to the subscription screen', () => {
    // Arrange
    render(<SubscriptionInterestSent />)

    // Act
    fireEvent.click(
      screen.getByRole('button', { name: 'Voltar para assinatura' })
    )

    // Assert
    expect(navigate).toHaveBeenCalledWith(
      subscriptionRouteMock.parentPath,
      subscriptionRouteMock.options
    )
  })
})
