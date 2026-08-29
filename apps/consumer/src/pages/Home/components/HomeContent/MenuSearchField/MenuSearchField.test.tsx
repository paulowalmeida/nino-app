import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'

import { MenuSearchField } from './MenuSearchField'
import { menuSearchFieldMock } from './MenuSearchField.mock'

vi.mock('@pages/Home/facades/useHomeFacade/useHomeFacade', () => ({ useHomeFacade: vi.fn() }))

describe('MenuSearchField', () => {
  it('exposes the menu search input', () => {
    vi.mocked(useHomeFacade).mockReturnValue({ search: menuSearchFieldMock.value, setSearch: vi.fn() } as never)
    render(<MenuSearchField />)
    expect(screen.getByRole('searchbox', { name: 'Buscar no cardápio' })).toHaveValue(menuSearchFieldMock.value)
  })
})
