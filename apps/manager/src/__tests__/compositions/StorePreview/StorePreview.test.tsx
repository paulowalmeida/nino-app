import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorePreview } from '@compositions/StorePreview/StorePreview'

describe(StorePreview.name, () => {
  it('shows the placeholder text and slug when name is empty', () => {
    // Arrange / Act
    render(<StorePreview name="" />)

    // Assert
    expect(screen.getByText('O nome da sua loja')).toBeInTheDocument()
    expect(
      screen.getByText('nino.delivery/sua-loja')
    ).toBeInTheDocument()
  })

  it('shows the typed name and its slug once something is typed', () => {
    // Arrange / Act
    render(<StorePreview name="Padaria do Zé" />)

    // Assert
    expect(screen.getByText('Padaria do Zé')).toBeInTheDocument()
    expect(
      screen.getByText('nino.delivery/padaria-do-ze')
    ).toBeInTheDocument()
  })

  it('treats a whitespace-only name as empty', () => {
    // Arrange / Act
    render(<StorePreview name="   " />)

    // Assert
    expect(screen.getByText('O nome da sua loja')).toBeInTheDocument()
  })

  it('uses the first letter of the typed name as the tile initial', () => {
    // Arrange / Act
    render(<StorePreview name="zebra lanches" />)

    // Assert
    expect(screen.getByText('Z')).toBeInTheDocument()
  })

  it('accepts custom placeholder text and slug', () => {
    // Arrange / Act
    render(<StorePreview name="" placeholder="Nome" placeholderSlug="x" />)

    // Assert
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('nino.delivery/x')).toBeInTheDocument()
  })
})
