import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { menuItemMock } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail.mock'

import { ProductDetailHeader } from './ProductDetailHeader'
import { productDetailHeaderMock } from './ProductDetailHeader.mock'

vi.mock(
  '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)

const mockItem = (item: typeof menuItemMock | null) =>
  vi.mocked(useProductDetailFacade).mockReturnValue({ item } as unknown as
    ReturnType<typeof useProductDetailFacade>)

describe('ProductDetailHeader', () => {
  beforeEach(() => vi.clearAllMocks())

  it('names the item and says it is on the menu', () => {
    mockItem(menuItemMock)

    render(<ProductDetailHeader />)

    expect(
      screen.getByRole('heading', { name: productDetailHeaderMock.name })
    ).toBeInTheDocument()
    expect(
      screen.getByText(productDetailHeaderMock.activeBadge)
    ).toBeInTheDocument()
  })

  it('flags an item the consumer cannot see', () => {
    mockItem({ ...menuItemMock, isActive: false })

    render(<ProductDetailHeader />)

    expect(
      screen.getByText(productDetailHeaderMock.inactiveBadge)
    ).toBeInTheDocument()
  })

  it('renders nothing while there is no item to name', () => {
    mockItem(null)

    const { container } = render(<ProductDetailHeader />)

    expect(container).toBeEmptyDOMElement()
  })
})
