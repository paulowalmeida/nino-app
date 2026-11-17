import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { MenuSearchField } from './MenuSearchField'
import { menuSearchFieldMock } from './MenuSearchField.mock'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)

describe('MenuSearchField', () => {
  it('opens the search instead of filtering the page', () => {
    const setSearchOpen = vi.fn()
    vi.mocked(useStorefrontFacade).mockReturnValue({ setSearchOpen } as never)
    render(<MenuSearchField />)
    fireEvent.click(
      screen.getByRole('button', { name: menuSearchFieldMock.label })
    )
    expect(setSearchOpen).toHaveBeenCalledWith(true)
  })
})
