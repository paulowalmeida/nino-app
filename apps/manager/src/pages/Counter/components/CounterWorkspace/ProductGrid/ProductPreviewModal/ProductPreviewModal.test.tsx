import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductPreviewModal } from './ProductPreviewModal'
import { productPreviewModalMock } from './ProductPreviewModal.mock'

vi.mock('@shared/components/ItemThumb/ItemThumb', () => ({
  ItemThumb: () => <span>thumb</span>,
}))
vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({ body }: { body: React.ReactNode }) => <div>{body}</div>,
}))

const item = {
  id: 'item-1',
  name: 'Café',
  price: '10',
  images: [],
  isActive: true,
  description: 'Quente',
  position: 1,
  category: { id: 'drinks', name: 'Bebidas', position: 1 },
}

describe(ProductPreviewModal.name, () => {
  it('renders the selected item details', () => {
    render(<ProductPreviewModal item={item} onOpenChange={vi.fn()} />)
    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.getByText('Quente')).toBeInTheDocument()
  })

  it('renders an empty modal body without an item', () => {
    render(
      <ProductPreviewModal
        {...productPreviewModalMock}
        onOpenChange={vi.fn()}
      />
    )
    expect(screen.queryByText('Café')).not.toBeInTheDocument()
  })
})
