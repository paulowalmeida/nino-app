import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ItemThumb } from './ItemThumb'
import { itemThumbMock } from './ItemThumb.mock'

describe(ItemThumb.name, () => {
  it('renders an accessible decorative thumbnail', () => {
    const { container } = render(<ItemThumb {...itemThumbMock} />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders a provided image source', () => {
    const { container } = render(<ItemThumb {...itemThumbMock} imageUrl="/coffee.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/coffee.png')
  })

  it('renders the fallback image source returned by the API', () => {
    const { container } = render(
      <ItemThumb
        {...itemThumbMock}
        fallbackUrl="/product-presets/x-bacon.png"
      />
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/product-presets/x-bacon.png'
    )
  })

  it('uses the default glyph for an unmatched name', () => {
    const { container } = render(<ItemThumb name="Produto desconhecido" />)
    expect(container).toHaveTextContent('🍽️')
  })
})
