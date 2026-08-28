import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'

import { NewProduct } from './NewProduct'

vi.mock('@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade')
vi.mock(
  '@pages/NewProduct/components/NewProductHeader/NewProductHeader',
  () => ({ NewProductHeader: () => <div>header</div> })
)
vi.mock('@pages/NewProduct/components/NewProductForm/NewProductForm', () => ({
  NewProductForm: () => <div>form</div>,
}))
vi.mock(
  '@pages/NewProduct/skeletons/NewProductFormSkeleton/NewProductFormSkeleton',
  () => ({ NewProductFormSkeleton: () => <div>loading form</div> })
)

const renderPage = () => render(<NewProduct />)

describe('NewProduct', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the registration form under the screen header', () => {
    vi.mocked(useNewProductFacade).mockReturnValue({
      isCategoriesPending: false,
    } as unknown as ReturnType<typeof useNewProductFacade>)

    renderPage()

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('form')).toBeInTheDocument()
  })

  it('holds the form until the categories arrive', () => {
    vi.mocked(useNewProductFacade).mockReturnValue({
      isCategoriesPending: true,
    } as unknown as ReturnType<typeof useNewProductFacade>)

    renderPage()

    expect(screen.getByText('loading form')).toBeInTheDocument()
    expect(screen.queryByText('form')).not.toBeInTheDocument()
  })
})
