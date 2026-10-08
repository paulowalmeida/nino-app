import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import {
  MenuBoardEmptyState,
} from '@pages/Catalog/components/MenuBoardEmptyState/MenuBoardEmptyState'
import { CATALOG_CAPABILITIES } from '@pages/Catalog/constants/catalog.constants'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import { menuBoardEmptyStateMock } from './MenuBoardEmptyState.mock'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

describe(MenuBoardEmptyState.name, () => {
  it('explains that the search returned no items', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      search: menuBoardEmptyStateMock.searching,
    } as unknown as ReturnType<typeof useCatalogFacade>)

    render(
      <MemoryRouter>
        <MenuBoardEmptyState />
      </MemoryRouter>
    )

    expect(
      screen.getByText(
        `Nenhum item com "${menuBoardEmptyStateMock.searching}". Tente outro nome.`
      )
    ).toBeInTheDocument()
  })

  it('invites the user to create the first item and lists what the screen does', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      search: '',
    } as unknown as ReturnType<typeof useCatalogFacade>)

    render(
      <MemoryRouter>
        <MenuBoardEmptyState />
      </MemoryRouter>
    )

    expect(screen.getByText(menuBoardEmptyStateMock.title)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Cadastrar primeiro item' })
    ).toBeInTheDocument()
    CATALOG_CAPABILITIES.forEach(({ title }) =>
      expect(screen.getByText(title)).toBeInTheDocument()
    )
  })
})
