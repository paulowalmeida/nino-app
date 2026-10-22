import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { FreeDeliveryStrip } from './FreeDeliveryStrip'
import { stripOfferMock } from './FreeDeliveryStrip.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('FreeDeliveryStrip', () => {
  it('shows the free delivery condition at the top of the menu', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: stripOfferMock,
    } as never)

    render(<FreeDeliveryStrip />)

    expect(screen.getByText(/Frete grátis acima de R\$\s60,00/)).toBeInTheDocument()
  })

  it('stays out of the way when the store has no visible campaign', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      freeDelivery: undefined,
    } as never)

    const { container } = render(<FreeDeliveryStrip />)

    expect(container).toBeEmptyDOMElement()
  })
})
