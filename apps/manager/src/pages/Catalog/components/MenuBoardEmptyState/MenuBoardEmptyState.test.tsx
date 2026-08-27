import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  MenuBoardEmptyState,
} from '@pages/Catalog/components/MenuBoardEmptyState/MenuBoardEmptyState'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import { menuBoardEmptyStateMock } from './MenuBoardEmptyState.mock'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

describe(MenuBoardEmptyState.name, () => {
  it('explains that the search returned no items', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      search: menuBoardEmptyStateMock.searching,
    } as unknown as ReturnType<typeof useCatalogFacade>)

    render(<MenuBoardEmptyState />)

    expect(
      screen.getByText(
        `Nenhum item com "${menuBoardEmptyStateMock.searching}". Tente outro nome.`
      )
    ).toBeInTheDocument()
  })

  it('invites the user to create the first item in an empty category', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      search: '',
    } as unknown as ReturnType<typeof useCatalogFacade>)

    render(<MenuBoardEmptyState />)

    expect(
      screen.getByText(menuBoardEmptyStateMock.categoryMessage)
    ).toBeInTheDocument()
  })
})
