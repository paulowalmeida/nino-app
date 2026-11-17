import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { PromotionBanner } from './PromotionBanner'
import { promotionBannerMock } from './PromotionBanner.mock'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)

const renderBanner = (offers: unknown[], extra: object = {}) => {
  vi.mocked(useStorefrontFacade).mockReturnValue({
    bannerOffers: offers,
    setFocusedPromotionId: vi.fn(),
    ...extra,
  } as never)
  return render(
    <MemoryRouter>
      <PromotionBanner />
    </MemoryRouter>
  )
}

describe('PromotionBanner', () => {
  it('renders nothing without banner offers', () => {
    const { container } = renderBanner([])

    expect(container).toBeEmptyDOMElement()
  })

  it('hides the controls with a single offer', () => {
    renderBanner(promotionBannerMock.offers.slice(0, 1))

    expect(screen.queryByLabelText('Próxima promoção')).not.toBeInTheDocument()
  })

  it('draws an art slide for offers without an image', () => {
    renderBanner([], {
      freeDelivery: { id: 'f1', type: 'FREE_DELIVERY', minOrderValue: 0 },
    })

    expect(screen.getByText('Frete grátis')).toBeInTheDocument()
  })

  it('opens the promotion detail when an image offer is not a package', () => {
    const setFocusedPromotionId = vi.fn()
    renderBanner(promotionBannerMock.offers.slice(1), { setFocusedPromotionId })

    fireEvent.click(screen.getByLabelText('Abrir Frete grátis'))

    expect(setFocusedPromotionId).toHaveBeenCalledWith('p2')
  })

  it('renders every offer in the track', () => {
    renderBanner(promotionBannerMock.offers)

    promotionBannerMock.offers.forEach((offer) =>
      expect(screen.getByAltText(offer.name)).toBeInTheDocument()
    )
  })

  it('scrolls the track when the next button is clicked', () => {
    const scrollTo = vi.fn()
    Element.prototype.scrollTo = scrollTo
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
    renderBanner(promotionBannerMock.offers)

    fireEvent.click(screen.getByLabelText('Próxima promoção'))

    expect(scrollTo).toHaveBeenCalledTimes(1)
  })
})
