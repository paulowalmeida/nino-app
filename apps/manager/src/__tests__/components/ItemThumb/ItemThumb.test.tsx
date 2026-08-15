import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ItemThumb } from '@components/ItemThumb/ItemThumb'

/** The tile is decorative (`aria-hidden`), so it has no accessible role. */
const photoIn = (container: HTMLElement) => container.querySelector('img')

describe(ItemThumb.name, () => {
  it('shows only the glyph tile when the item has no photo', () => {
    // Arrange / Act
    const { container } = render(<ItemThumb name="X-Burguer" />)

    // Assert
    expect(photoIn(container)).toBeNull()
    expect(screen.getByText('🍔')).toBeInTheDocument()
  })

  it('shows only the glyph tile when imageUrl is null or empty', () => {
    // Arrange / Act
    const { container: withNull } = render(
      <ItemThumb name="X-Burguer" imageUrl={null} />
    )
    const { container: withEmpty } = render(
      <ItemThumb name="X-Burguer" imageUrl="" />
    )

    // Assert
    expect(photoIn(withNull)).toBeNull()
    expect(photoIn(withEmpty)).toBeNull()
  })

  it('keeps the tile in place while the photo is still downloading', () => {
    // Arrange
    const name = 'X-Burguer'

    // Act
    const { container } = render(
      <ItemThumb name={name} imageUrl="/burger.jpg" />
    )

    // Assert
    expect(photoIn(container)).not.toBeNull()
    expect(screen.getByText('🍔')).toBeInTheDocument()
  })

  it('falls back to the glyph tile when the photo fails to load', () => {
    // Arrange
    const { container } = render(
      <ItemThumb name="X-Burguer" imageUrl="/broken.jpg" />
    )
    const image = photoIn(container)

    // Act
    fireEvent.error(image!)

    // Assert
    expect(photoIn(container)).toBeNull()
    expect(screen.getByText('🍔')).toBeInTheDocument()
  })
})
