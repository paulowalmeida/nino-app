import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ItemThumb } from './ItemThumb'
import { itemThumbMock } from './ItemThumb.mock'

describe(ItemThumb.name, () => {
  it('renders an accessible decorative thumbnail', () => {
    const { container } = render(
      <ItemThumb {...itemThumbMock} imageUrl="/coffee.png" />
    )
    expect(container.querySelector('img')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders a provided image source', () => {
    const { container } = render(
      <ItemThumb {...itemThumbMock} imageUrl="/coffee.png" />
    )
    expect(container.querySelector('img')).toHaveAttribute('src', '/coffee.png')
  })

  it('anchors the API fallback path to the API base url', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    // Act
    const { container } = render(
      <ItemThumb
        {...itemThumbMock}
        fallbackUrl="/product-presets/x-bacon.png"
      />
    )

    // Assert
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://api-dev.nino.delivery/product-presets/x-bacon.png'
    )
    vi.unstubAllEnvs()
  })

  it('keeps a neutral slot instead of an emoji when no image exists', () => {
    const { container } = render(<ItemThumb name="Produto desconhecido" />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).not.toHaveTextContent('🍽️')
  })
})
