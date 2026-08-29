import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DraggableOrder } from './DraggableOrder'

const { useSortable } = vi.hoisted(() => ({
  useSortable: vi.fn(() => ({
    attributes: { 'aria-roledescription': 'sortable' },
    isDragging: false,
    listeners: { onPointerDown: vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
  })),
}))

vi.mock('@dnd-kit/sortable', () => ({ useSortable }))
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}))

describe(DraggableOrder.name, () => {
  it('connects the card to the sortable context', () => {
    render(<DraggableOrder orderId="order-1">comanda</DraggableOrder>)

    expect(useSortable).toHaveBeenCalledWith({ id: 'order-1' })
    expect(screen.getByText('comanda')).toBeInTheDocument()
  })
})
