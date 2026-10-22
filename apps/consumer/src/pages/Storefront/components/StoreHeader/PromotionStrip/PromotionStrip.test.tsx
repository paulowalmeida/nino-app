import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { PromotionStrip } from './PromotionStrip'
import { stripDiscountMock, stripFreeDeliveryMock } from './PromotionStrip.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('PromotionStrip', () => {
  it('shows free delivery and the automatic discount at the top of the menu', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: stripFreeDeliveryMock,
      discountOffer: stripDiscountMock,
    } as never)

    render(<PromotionStrip />)

    expect(screen.getByText(/Frete grátis acima de R\$\s60,00/)).toBeInTheDocument()
    expect(
      screen.getByText(/10% de desconto \(até R\$\s15,00\) acima de R\$\s50,00/)
    ).toBeInTheDocument()
  })

  it('stays out of the way when the store has no visible campaign', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: undefined,
      discountOffer: undefined,
    } as never)

    const { container } = render(<PromotionStrip />)

    expect(container).toBeEmptyDOMElement()
  })
})
