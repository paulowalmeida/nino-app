import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscriptionFacade } from './facades/useSubscriptionFacade/useSubscriptionFacade'
import { Subscription } from './Subscription'
import { subscriptionPageMock } from './Subscription.mock'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock(
  '@pages/Subscription/facades/useSubscriptionFacade/useSubscriptionFacade'
)
vi.mock(
  '@pages/Subscription/components/SubscriptionCard/SubscriptionCard',
  () => ({
    SubscriptionCard: ({
      onRequestInterest,
    }: {
      onRequestInterest: () => void
    }) => (
      <button type="button" onClick={onRequestInterest}>
        subscription card
      </button>
    ),
  })
)
vi.mock(
  '@pages/Subscription/skeletons/SubscriptionSkeleton/SubscriptionSkeleton',
  () => ({ SubscriptionSkeleton: () => <div>loading subscription</div> })
)

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSubscriptionFacade).mockReturnValue({
    subscription: undefined,
    isPending: false,
    isError: false,
    isUpdateError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSubscriptionFacade>)

describe('Subscription', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the plan of the company once it loads', () => {
    facadeWith({
      subscription: { plan: { name: subscriptionPageMock.planName } },
    })

    render(<Subscription />)

    expect(
      screen.getByRole('heading', { name: /Assinatura/ })
    ).toBeInTheDocument()
    expect(screen.getByText('subscription card')).toBeInTheDocument()
    expect(screen.queryByText('loading subscription')).not.toBeInTheDocument()
  })

  it('holds the card while the plan is on its way', () => {
    facadeWith({ isPending: true })

    render(<Subscription />)

    expect(screen.getByText('loading subscription')).toBeInTheDocument()
    expect(screen.queryByText('subscription card')).not.toBeInTheDocument()
  })

  it('reports a plan it could not read', () => {
    facadeWith({ isError: true })

    render(<Subscription />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      subscriptionPageMock.errorMessage
    )
  })

  it('reports when a subscription action fails', () => {
    facadeWith({ isUpdateError: true })

    render(<Subscription />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível atualizar a assinatura agora.'
    )
  })

  it('reports when the available plans could not be read', () => {
    facadeWith({ isPlansError: true })

    render(<Subscription />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os planos disponíveis.'
    )
  })

  it('shows feedback while the available plans are loading', () => {
    facadeWith({ isPlansPending: true })

    render(<Subscription />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Carregando planos disponíveis...'
    )
  })

  it('opens the Rede plan request from the card', () => {
    // Arrange
    facadeWith({
      subscription: { plan: { name: subscriptionPageMock.planName } },
    })
    render(<Subscription />)

    // Act
    fireEvent.click(screen.getByText('subscription card'))

    // Assert
    expect(navigate).toHaveBeenCalledWith(subscriptionPageMock.redeRequestPath)
  })
})
