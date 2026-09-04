import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { CartLine } from '@shared/types/counter/cart-line'
import type { MenuSection } from '@shared/types/product/menu-section'

import { ProductGrid } from './ProductGrid'
import { productGridPickedLines } from './ProductGrid.mock'

vi.mock('@shared/components/CategoryChips/CategoryChips', () => ({
  CategoryChips: ({ onChange }: { onChange: (id: string) => void }) => (
    <button onClick={() => onChange('drinks')}>category</button>
  ),
}))
vi.mock('./ProductCard/ProductCard', () => ({
  ProductCard: ({
    item,
    isPicked,
    onPick,
    onPreviewStart,
    onPreviewEnd,
  }: {
    item: { name: string }
    isPicked: boolean
    onPick: (item: unknown) => void
    onPreviewStart: (item: unknown) => void
    onPreviewEnd: () => void
  }) => (
    <button
      aria-pressed={isPicked}
      onClick={() => onPick(item)}
      onMouseEnter={() => onPreviewStart(item)}
      onMouseLeave={onPreviewEnd}
    >
      {item.name}
    </button>
  ),
}))
vi.mock('./ProductPreviewModal/ProductPreviewModal', () => ({
  ProductPreviewModal: ({
    onOpenChange,
  }: {
    onOpenChange: (open: boolean) => void
  }) => <button onClick={() => onOpenChange(false)}>preview-close</button>,
}))
const facadeState = vi.hoisted(() => ({
  sections: [] as MenuSection[],
  isPending: false,
  lines: [] as CartLine[],
  add: vi.fn(),
}))
vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: () => facadeState,
}))

const sections = [
  {
    id: 'drinks',
    name: 'Bebidas',
    position: 1,
    items: [
      {
        id: 'item-1',
        name: 'Café',
        price: '10',
        description: null,
        position: 1,
        isActive: true,
        images: [],
        category: { id: 'drinks', name: 'Bebidas', position: 1 },
      },
    ],
  },
]

describe(ProductGrid.name, () => {
  it('renders loading and empty states', () => {
    facadeState.isPending = true
    const { container, rerender } = render(<ProductGrid />)
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
    facadeState.isPending = false
    rerender(<ProductGrid />)
    expect(screen.getByText(/cardápio está vazio/)).toBeInTheDocument()
  })

  it('searches products and changes category', () => {
    facadeState.sections = sections
    const { rerender } = render(<ProductGrid />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'café' } })
    expect(screen.getByRole('button', { name: 'Café' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } })
    expect(screen.getByText(/Nenhum item/)).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'category' }))
    expect(screen.getByRole('button', { name: 'Café' })).toBeInTheDocument()
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Café' }))
    fireEvent.mouseLeave(screen.getByRole('button', { name: 'Café' }))
    fireEvent.click(screen.getByRole('button', { name: 'preview-close' }))
    facadeState.sections = [{ ...sections[0], id: 'other' }]
    rerender(<ProductGrid />)
  })

  it('marks a product already on the ticket', () => {
    // Arrange
    facadeState.sections = sections
    facadeState.lines = productGridPickedLines

    // Act
    render(<ProductGrid />)

    // Assert
    expect(screen.getByRole('button', { name: 'Café' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
