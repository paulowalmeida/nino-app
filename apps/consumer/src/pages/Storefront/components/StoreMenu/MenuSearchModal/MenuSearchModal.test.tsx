import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { MenuSearchModal } from './MenuSearchModal'
import { menuSearchModalMock } from './MenuSearchModal.mock'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({ useStorefrontFacade: vi.fn() })
)

const setSearchOpen = vi.fn()
const setSearch = vi.fn()
const openProduct = vi.fn()

const mockFacade = (overrides = {}) =>
  vi.mocked(useStorefrontFacade).mockReturnValue({
    isSearchOpen: true,
    setSearchOpen,
    search: '',
    setSearch,
    searchResults: [],
    hasSearchQuery: false,
    sections: menuSearchModalMock.sections,
    store: undefined,
    hours: [],
    isHoursPending: false,
    quantityByProduct: {},
    addFromMenu: vi.fn(),
    openProduct,
    isDesktop: false,
    ...overrides,
  } as never)

describe('MenuSearchModal', () => {
  beforeEach(() => vi.clearAllMocks())

  it('suggests categories before anything is typed', () => {
    mockFacade()
    render(<MenuSearchModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Lanches' }))
    expect(setSearch).toHaveBeenCalledWith('Lanches')
  })

  it('offers to clear when nothing matches', () => {
    mockFacade({ search: 'xyz', hasSearchQuery: true })
    render(<MenuSearchModal />)
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))
    expect(setSearch).toHaveBeenCalledWith('')
  })

  it('opens the first result on Enter and closes the search', () => {
    mockFacade({
      search: 'pao',
      hasSearchQuery: true,
      searchResults: [
        { item: menuSearchModalMock.item, categoryName: 'Lanches' },
      ],
    })
    render(<MenuSearchModal />)
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' })
    expect(setSearchOpen).toHaveBeenCalledWith(false)
    expect(openProduct).toHaveBeenCalledWith(menuSearchModalMock.item)
  })
})
