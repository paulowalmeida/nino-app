import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Catalog } from '@pages/Catalog/Catalog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import { catalogPageMock } from './Catalog.mock'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

vi.mock('@pages/Catalog/components/CatalogHeader/CatalogHeader', () => ({
  CatalogHeader: () => <div>header</div>,
}))

vi.mock('@pages/Catalog/components/CatalogContent/CatalogContent', () => ({
  CatalogContent: () => <div>board</div>,
}))

vi.mock(
  '@pages/Catalog/components/CatalogDeleteItemDialog/CatalogDeleteItemDialog',
  () => ({
    CatalogDeleteItemDialog: () => <div>delete-item-dialog</div>,
  })
)

vi.mock(
  '@pages/Catalog/components/CatalogDeleteItemsDialog/CatalogDeleteItemsDialog',
  () => ({
    CatalogDeleteItemsDialog: () => <div>delete-items-dialog</div>,
  })
)

describe(Catalog.name, () => {
  beforeEach(() => {
    vi.mocked(useCatalogFacade).mockReturnValue(
      catalogPageMock.successWithItems as unknown as ReturnType<
        typeof useCatalogFacade
      >
    )
  })

  it('composes the header and board regions without prop plumbing', () => {
    render(<Catalog />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('board')).toBeInTheDocument()
  })

  it('keeps the screen error state under Page governance', () => {
    vi.mocked(useCatalogFacade).mockReturnValue(
      catalogPageMock.error as unknown as ReturnType<typeof useCatalogFacade>
    )

    render(<Catalog />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      catalogPageMock.errorMessage
    )
    expect(screen.queryByText('board')).not.toBeInTheDocument()
  })

  it('renders the empty state from the Page', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      ...catalogPageMock.empty,
      search: 'suco',
    } as unknown as ReturnType<typeof useCatalogFacade>)

    render(<Catalog />)

    expect(
      screen.getByText('Nenhum item com "suco". Tente outro nome.')
    ).toBeInTheDocument()
    expect(screen.queryByText('board')).not.toBeInTheDocument()
  })

  it('renders the loading skeleton while the catalog is pending', () => {
    vi.mocked(useCatalogFacade).mockReturnValue(
      catalogPageMock.loading as unknown as ReturnType<typeof useCatalogFacade>
    )

    render(<Catalog />)

    expect(screen.queryByText('board')).not.toBeInTheDocument()
    expect(
      screen.queryByText(catalogPageMock.errorMessage)
    ).not.toBeInTheDocument()
  })
})
