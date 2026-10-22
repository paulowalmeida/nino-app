import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CartPromotionProgress } from './CartPromotionProgress'
import { cartGiftMock, cartOfferMock } from './CartPromotionProgress.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

const withCart = (cartTotal: number) =>
  vi.mocked(useStorefrontFacade).mockReturnValue({
    freeDelivery: cartOfferMock,
    giftOffer: undefined,
    cartTotal,
  } as never)

describe('CartPromotionProgress', () => {
  it('says how much is missing for free delivery', () => {
    withCart(47.6)

    render(<CartPromotionProgress />)

    expect(screen.getByRole('status')).toHaveTextContent(
      /Faltam R\$\s12,40 para frete grátis/
    )
  })

  it('celebrates once the minimum is reached', () => {
    withCart(60)

    render(<CartPromotionProgress />)

    expect(screen.getByText('Frete grátis liberado na entrega')).toBeInTheDocument()
  })

  it('shows nothing when the store has no free delivery campaign', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: undefined,
      giftOffer: undefined,
      cartTotal: 10,
    } as never)

    const { container } = render(<CartPromotionProgress />)

    expect(container).toBeEmptyDOMElement()
  })

  it('counts down to the gift alongside free delivery', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: cartOfferMock,
      giftOffer: cartGiftMock,
      cartTotal: 70,
    } as never)

    render(<CartPromotionProgress />)

    expect(screen.getByText('Frete grátis liberado na entrega')).toBeInTheDocument()
    expect(
      screen.getByText(/para ganhar Coca-Cola Lata/)
    ).toHaveTextContent(/Faltam R\$\s10,00/)
  })
})
