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

  it('does not open the preview when the pointer drags to scroll', () => {
    vi.useFakeTimers()
    const onPreviewStart = vi.fn()
    render(
      <ProductCard
        item={item}
        onPick={vi.fn()}
        onPreviewStart={onPreviewStart}
        onPreviewEnd={vi.fn()}
      />
    )
    const card = screen.getByText('Café').closest('div') as Element
    fireEvent.pointerDown(card, { clientX: 0, clientY: 0 })
    fireEvent.pointerMove(card, { clientX: 40, clientY: 0 })
    act(() => vi.advanceTimersByTime(450))
    fireEvent.pointerUp(card)
    expect(onPreviewStart).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('opens quantity controls when hovering the picked card', async () => {
    render(
      <ProductCard
        item={item}
        isPicked
        quantity={1}
        onPick={vi.fn()}
        onStep={vi.fn()}
        onPreviewStart={vi.fn()}
        onPreviewEnd={vi.fn()}
      />
    )

    const card = screen.getByText('Café').closest('[role="button"]')
    if (!card) throw new Error('Card do produto não encontrado')
    fireEvent.pointerEnter(card, { pointerType: 'mouse' })

    expect(
      await screen.findByRole('button', { name: 'Mais um Café' })
    ).toBeInTheDocument()
  })

  it('keeps opening quantity controls by clicking the badge', async () => {
    render(
      <ProductCard
        item={item}
        isPicked
        quantity={1}
        onPick={vi.fn()}
        onStep={vi.fn()}
        onPreviewStart={vi.fn()}
        onPreviewEnd={vi.fn()}
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar quantidade de Café: 1',
      })
    )

    expect(
      await screen.findByRole('button', { name: 'Mais um Café' })
    ).toBeInTheDocument()
  })

  it('keeps quantity controls open when returning from the popover to the card', async () => {
    vi.useFakeTimers()
    render(
      <ProductCard
        item={item}
        isPicked
        quantity={1}
        onPick={vi.fn()}
        onStep={vi.fn()}
        onPreviewStart={vi.fn()}
        onPreviewEnd={vi.fn()}
      />
    )

    const card = screen.getByText('Café').closest('[role="button"]')
    if (!card) throw new Error('Card do produto não encontrado')
    fireEvent.pointerEnter(card, { pointerType: 'mouse' })
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    const panelButton = screen.getByRole('button', {
      name: 'Mais um Café',
    })
    fireEvent.pointerLeave(panelButton, { pointerType: 'mouse' })
    fireEvent.pointerMove(card, { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(100))

    expect(
      screen.getByRole('button', { name: 'Mais um Café' })
    ).toBeInTheDocument()
    vi.useRealTimers()
  })
})
