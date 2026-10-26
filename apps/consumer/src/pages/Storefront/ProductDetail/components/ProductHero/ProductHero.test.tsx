import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductHero } from './ProductHero'
import { productHeroMock } from './ProductHero.mock'

const navigate = vi.fn()
let isDesktop = false

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock(
  '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade',
  () => ({
    useProductDetailFacade: () => ({
      product: productHeroMock.product,
      slug: productHeroMock.slug,
    }),
  })
)

vi.mock('@pages/Storefront/hooks/useIsDesktop/useIsDesktop', () => ({
  useIsDesktop: () => isDesktop,
}))

describe('ProductHero', () => {
  it('shows the back button on mobile/tablet', () => {
    // Arrange
    isDesktop = false

    // Act
    render(<ProductHero />)

    // Assert
    expect(
      screen.getByRole('button', { name: 'Voltar ao cardápio' })
    ).toBeInTheDocument()
  })

  it('hides the back button on desktop, letting the Modal close it', () => {
    // Arrange
    isDesktop = true

    // Act
    render(<ProductHero />)

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Voltar ao cardápio' })
    ).not.toBeInTheDocument()
  })
})
