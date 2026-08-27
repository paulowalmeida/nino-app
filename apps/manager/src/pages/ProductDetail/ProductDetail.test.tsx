import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import { ProductDetail } from './ProductDetail'
import { productDetailPageMock } from './ProductDetail.mock'

vi.mock(
  '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)
vi.mock(
  '@pages/ProductDetail/skeletons/ProductDetailSkeleton/ProductDetailSkeleton',
  () => ({
    ProductDetailSkeleton: () => <div>carregando ficha</div>,
  })
)
vi.mock(
  '@pages/ProductDetail/components/ProductMissingNotice/ProductMissingNotice',
  () => ({ ProductMissingNotice: () => <div>item fora do cardápio</div> })
)
vi.mock(
  '@pages/ProductDetail/components/ProductDetailHeader/ProductDetailHeader',
  () => ({ ProductDetailHeader: () => <div>cabeçalho do item</div> })
)
vi.mock(
  '@pages/ProductDetail/components/ProductDetailForm/ProductDetailForm',
  () => ({ ProductDetailForm: () => <div>formulário do item</div> })
)

const mockScreenState = (state: {
  isPending: boolean
  isMissing: boolean
  isReady: boolean
}) =>
  vi.mocked(useProductDetailFacade).mockReturnValue(
    state as unknown as ReturnType<typeof useProductDetailFacade>
  )

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProductDetail />
    </MemoryRouter>
  )

describe('ProductDetail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the item card with its header and form', () => {
    mockScreenState({ isPending: false, isMissing: false, isReady: true })

    renderPage()

    expect(
      screen.getByRole('link', { name: productDetailPageMock.backLabel })
    ).toBeInTheDocument()
    expect(
      screen.getByText(productDetailPageMock.headerLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByText(productDetailPageMock.formLabel)
    ).toBeInTheDocument()
  })

  it('holds the card until the menu arrives', () => {
    mockScreenState({ isPending: true, isMissing: false, isReady: false })

    renderPage()

    expect(
      screen.getByText(productDetailPageMock.skeletonLabel)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(productDetailPageMock.formLabel)
    ).not.toBeInTheDocument()
  })

  it('says the item left the menu instead of showing an empty card', () => {
    mockScreenState({ isPending: false, isMissing: true, isReady: false })

    renderPage()

    expect(
      screen.getByText(productDetailPageMock.missingLabel)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(productDetailPageMock.headerLabel)
    ).not.toBeInTheDocument()
  })
})
