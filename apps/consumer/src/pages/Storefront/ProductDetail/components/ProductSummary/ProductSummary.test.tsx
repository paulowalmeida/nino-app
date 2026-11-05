import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import { ProductSummary } from './ProductSummary'
import { productSummaryMock } from './ProductSummary.mock'

vi.mock(
  '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)
vi.mock('./ProductSummary.module.css', () => ({
  default: new Proxy(
    {},
    { get: (_target, property: string) => property }
  ),
}))

describe('ProductSummary', () => {
  it('renders the compact sticky identity for the choice list owner', () => {
    vi.mocked(useProductDetailFacade).mockReturnValue({
      product: productSummaryMock,
    } as never)

    render(<ProductSummary compact />)

    const heading = screen.getByRole('heading', {
      name: productSummaryMock.name,
    })

    expect(heading).toBeInTheDocument()
    expect(heading.closest('.productIdentity')).toBeInTheDocument()
    expect(screen.getByText('R$ 24,90')).toBeInTheDocument()
  })

  it('keeps the description in the normal details flow', () => {
    vi.mocked(useProductDetailFacade).mockReturnValue({
      product: productSummaryMock,
    } as never)

    render(<ProductSummary />)

    expect(
      screen.getByText(productSummaryMock.description as string)
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: productSummaryMock.name })).not.toBeInTheDocument()
  })
})
