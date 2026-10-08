import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CartLine } from '@shared/types/counter/cart-line'
import type { MenuSection } from '@shared/types/product/menu-section'

import { ProductGrid } from './ProductGrid'
import { productGridPickedLines } from './ProductGrid.mock'

vi.mock('./CounterEmptyMenu/CounterEmptyMenu', () => ({
  CounterEmptyMenu: () => <p>empty menu</p>,
}))

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
  isError: false,
  isSuccess: false,
  error: null as Error | null,
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
  beforeEach(() => {
    facadeState.sections = []
    facadeState.isPending = false
    facadeState.isError = false
    facadeState.isSuccess = true
    facadeState.error = null
    facadeState.lines = []
    facadeState.add.mockClear()
  })

  it('keeps the layout without claiming the catalog is empty', () => {
    facadeState.isPending = true
    const { container, rerender } = render(<ProductGrid />)
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
    facadeState.isPending = false
    facadeState.isSuccess = true
    rerender(<ProductGrid />)
    expect(screen.queryByText(/cardápio está vazio/)).not.toBeInTheDocument()
    expect(screen.getByText('empty menu')).toBeInTheDocument()
  })

  it('keeps the skeleton until the menu query is complete', () => {
    facadeState.isSuccess = false
    const { container } = render(<ProductGrid />)

    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
  })

  it('shows an error instead of an empty-state message after a failed request', () => {
    facadeState.isError = true
    facadeState.isSuccess = false
    facadeState.error = new Error('Request timed out')

    render(<ProductGrid />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Não foi possível carregar o cardápio.*excedeu o tempo limite/
    )
    expect(screen.queryByText(/cardápio está vazio/)).not.toBeInTheDocument()
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

  it('asks for configuration before adding a product with modifiers', async () => {
    facadeState.sections = [
      {
        ...sections[0],
        items: [
          {
            ...sections[0].items[0],
            modifiers: [
              {
                id: 'modifier-1',
                name: 'Ponto da carne',
                description: null,
                role: 'ADDITION',
                minSelections: 1,
                maxSelections: 1,
                options: [{ id: 'option-1', name: 'Ao ponto', price: '0' }],
              },
            ],
          },
        ],
      },
    ]
    facadeState.lines = []

    render(<ProductGrid />)
    await userEvent.click(screen.getByRole('button', { name: 'Café' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Ponto da carne')).toBeInTheDocument()
    expect(facadeState.add).not.toHaveBeenCalled()
  })
})
