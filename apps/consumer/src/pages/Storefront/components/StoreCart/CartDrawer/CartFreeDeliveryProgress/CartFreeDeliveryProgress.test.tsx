import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CartFreeDeliveryProgress } from './CartFreeDeliveryProgress'
import { cartOfferMock } from './CartFreeDeliveryProgress.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

const withCart = (cartTotal: number) =>
  vi.mocked(useStorefrontFacade).mockReturnValue({
    freeDelivery: cartOfferMock,
    cartTotal,
  } as never)

describe('CartFreeDeliveryProgress', () => {
  it('says how much is missing for free delivery', () => {
    withCart(47.6)

    render(<CartFreeDeliveryProgress />)

    expect(screen.getByRole('status')).toHaveTextContent(
      /Faltam R\$\s12,40 para frete grátis/
    )
  })

  it('celebrates once the minimum is reached', () => {
    withCart(60)

    render(<CartFreeDeliveryProgress />)

    expect(screen.getByText('Frete grátis liberado na entrega')).toBeInTheDocument()
  })

  it('shows nothing when the store has no free delivery campaign', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: undefined,
      cartTotal: 10,
    } as never)

    const { container } = render(<CartFreeDeliveryProgress />)

    expect(container).toBeEmptyDOMElement()
  })
})
