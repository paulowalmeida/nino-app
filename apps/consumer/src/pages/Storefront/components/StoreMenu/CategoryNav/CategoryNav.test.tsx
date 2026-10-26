import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CategoryNav } from './CategoryNav'
import { categoryNavMock } from './CategoryNav.mock'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}))
vi.mock('@nino/ds/components/Text', () => ({
  Text: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}))
vi.mock('@nino/ds/components/Chip', () => ({
  Chip: ({ children }: { children?: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))
vi.mock('@utils/category-icon', () => ({ categoryIcon: () => null }))

describe('CategoryNav', () => {
  it('exports the category navigation contract', () => {
    expect(CategoryNav).toBeDefined()
    expect(categoryNavMock.activeId).toBe('burgers')
  })

  it('renders only categories that remain in the filtered results', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      visibleSections: [{ id: 'burgers', name: 'Hambúrgueres' }],
      activeId: null,
      goToSection: vi.fn(),
    } as never)

    render(<CategoryNav />)

    expect(
      screen.getByRole('button', { name: 'Hambúrgueres' })
    ).toBeInTheDocument()
  })
})
