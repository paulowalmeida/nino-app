import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { MenuSearchField } from './MenuSearchField'
import { menuSearchFieldMock } from './MenuSearchField.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('MenuSearchField', () => {
  it('exposes the menu search input', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      search: menuSearchFieldMock.value,
      setSearch: vi.fn(),
    } as never)
    render(<MenuSearchField />)
    expect(
      screen.getByRole('searchbox', { name: 'Buscar no cardápio' })
    ).toHaveValue(menuSearchFieldMock.value)
  })
})
