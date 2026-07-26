import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ItemThumb } from './ItemThumb'

/** A miniatura é decorativa (`aria-hidden`), então não tem papel acessível. */
const photoIn = (container: HTMLElement) => container.querySelector('img')

describe('ItemThumb', () => {
  it('shows only the glyph tile when the item has no photo', () => {
    const { container } = render(<ItemThumb name="X-Burguer" />)

    expect(photoIn(container)).toBeNull()
    expect(screen.getByText('🍔')).toBeInTheDocument()
  })

  /**
   * O ponto do conserto: a linha da lista aparece assim que o JSON chega, mas
   * a foto ainda está baixando — o ladrilho precisa estar lá segurando o
   * lugar, senão sobra um buraco.
   */
  it('keeps the tile in place while the photo is still downloading', () => {
    const { container } = render(
      <ItemThumb name="X-Burguer" imageUrl="/burger.jpg" />
    )

    expect(photoIn(container)).toHaveClass('opacity-0')
    expect(screen.getByText('🍔')).toBeInTheDocument()
  })
})
