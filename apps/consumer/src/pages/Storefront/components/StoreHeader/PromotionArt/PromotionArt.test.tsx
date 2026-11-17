import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PromotionArt } from './PromotionArt'
import { fixedDiscountMock, freeDeliveryMock } from './PromotionArt.mock'

describe('PromotionArt', () => {
  it('shows the food delivery scene and the benefit', () => {
    const { container } = render(
      <PromotionArt promotion={freeDeliveryMock} onSelect={vi.fn()} />
    )

    expect(screen.getByText('Frete grátis')).toBeInTheDocument()
    expect(container.querySelector('img[src="/free-delivery-rider-illustration.png"]')).toBeInTheDocument()
    expect(container.querySelector('svg use[href*="truck"]')).not.toBeInTheDocument()
  })

  it('hangs the price tag instead of a dish on a store-wide discount', () => {
    const { container } = render(
      <PromotionArt
        promotion={{ ...fixedDiscountMock, eligibleProductIds: [] }}
        photos={['/burger.jpg']}
        onSelect={vi.fn()}
      />
    )

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg text')).toHaveTextContent('R$')
  })

  it('reports the selected promotion on click', () => {
    const onSelect = vi.fn()
    render(<PromotionArt promotion={fixedDiscountMock} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(fixedDiscountMock)
  })
})
