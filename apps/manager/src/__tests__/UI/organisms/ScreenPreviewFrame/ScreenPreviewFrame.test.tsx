import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScreenPreviewFrame } from
  '@organisms/ScreenPreviewFrame/ScreenPreviewFrame'

describe(ScreenPreviewFrame.name, () => {
  it('shows the screen name in the title bar', () => {
    // Arrange / Act
    render(<ScreenPreviewFrame screen="Pedidos">conteúdo</ScreenPreviewFrame>)

    // Assert
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
  })

  it('renders the children inside an inert, non-interactive wrapper', () => {
    // Arrange / Act
    render(
      <ScreenPreviewFrame screen="Cozinha">
        <button>não clicável</button>
      </ScreenPreviewFrame>
    )

    // Assert
    const button = screen.getByText('não clicável')
    expect(button.closest('[inert]')).not.toBeNull()
  })

  it('renders with no screen name given as empty text', () => {
    // Arrange / Act
    render(<ScreenPreviewFrame screen="">conteúdo</ScreenPreviewFrame>)

    // Assert
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })
})
