import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductCard } from './ProductCard'

vi.mock('@shared/components/ItemThumb/ItemThumb', () => ({
  ItemThumb: () => <span>thumb</span>,
}))
const item = {
  id: 'item-1',
  name: 'Café',
  price: '10',
  description: null,
  position: 1,
  images: [],
  isActive: true,
  category: { id: 'drinks', name: 'Bebidas', position: 1 },
}

describe(ProductCard.name, () => {
  it('renders and selects a product', () => {
    vi.useFakeTimers()
    const onPick = vi.fn()
    const onPreviewStart = vi.fn()
    const onPreviewEnd = vi.fn()
    render(
      <ProductCard
        item={item}
        index={0}
        onPick={onPick}
        onPreviewStart={onPreviewStart}
        onPreviewEnd={onPreviewEnd}
      />
    )
    expect(screen.getByText('Café')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Café'))
    expect(onPick).toHaveBeenCalledWith(item)
    fireEvent.pointerDown(screen.getByText('Café').closest('div') as Element)
    act(() => vi.advanceTimersByTime(450))
    fireEvent.pointerUp(screen.getByText('Café').closest('div') as Element)
    expect(onPreviewStart).toHaveBeenCalledWith(item)
    expect(onPreviewEnd).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})
