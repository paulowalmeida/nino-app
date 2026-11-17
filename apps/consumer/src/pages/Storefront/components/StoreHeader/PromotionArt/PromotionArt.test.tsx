import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PromotionArt } from './PromotionArt'
import { fixedDiscountMock, freeDeliveryMock } from './PromotionArt.mock'

describe('PromotionArt', () => {
  it('writes the benefit from the promotion data', () => {
    render(<PromotionArt promotion={freeDeliveryMock} onSelect={vi.fn()} />)

    expect(screen.getByText('Frete grátis')).toBeInTheDocument()
  })

  it('reports the selected promotion on click', () => {
    const onSelect = vi.fn()
    render(<PromotionArt promotion={fixedDiscountMock} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(fixedDiscountMock)
  })
})
